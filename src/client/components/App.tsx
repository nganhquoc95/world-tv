import React, { useState, useMemo } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Player from './Player';
import { useChannels, useCountries, useCategories } from '../hooks/useApi';
import { IChannelItem } from '../types';
import '../styles/App.css';

function App() {
    const { channels, loading } = useChannels();
    const { countries } = useCountries();
    const { categories } = useCategories();

    const [selectedChannel, setSelectedChannel] = useState<IChannelItem | null>(null);
    const [filterCountry, setFilterCountry] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [pageSize] = useState(50);
    const [currentPage, setCurrentPage] = useState(1);

    // Create country name map
    const countryNameMap = useMemo(() => {
        const map: Record<string, string> = {};
        countries.forEach(country => {
            map[country.code] = country.name;
        });
        return map;
    }, [countries]);

    // Extract unique groups from channels
    const groups = useMemo(() => {
        const groupSet = new Set<string>();
        channels.forEach(ch => {
            if (ch.groupTitle) groupSet.add(ch.groupTitle);
        });
        return Array.from(groupSet).sort();
    }, [channels]);

    // Filter channels
    const filteredChannels = useMemo(() => {
        return channels.filter(ch => {
            const matchCountry = !filterCountry || ch.countryCode === filterCountry;
            const matchCategory = !filterCategory || ch.categories?.includes(filterCategory);
            const matchSearch = !searchQuery || 
                ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ch.groupTitle?.toLowerCase().includes(searchQuery.toLowerCase());
            
            return matchCountry && matchCategory && matchSearch;
        });
    }, [channels, filterCountry, filterCategory, searchQuery]);

    // Paginate channels
    const paginatedChannels = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const end = start + pageSize;
        return filteredChannels.slice(start, end);
    }, [filteredChannels, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredChannels.length / pageSize);

    if (loading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
                <p>Loading channels...</p>
            </div>
        );
    }

    return (
        <div className="app">
            <Header
                countryNameMap={countryNameMap}
                filterCountry={filterCountry}
                setFilterCountry={setFilterCountry}
                filterCategory={filterCategory}
                setFilterCategory={setFilterCategory}
                categories={categories}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
            />
            
            <div className="main-container">
                <Sidebar
                    channels={paginatedChannels}
                    selectedChannel={selectedChannel}
                    setSelectedChannel={setSelectedChannel}
                    filteredCount={filteredChannels.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    channelCount={channels.length}
                    groupCount={groups.length}
                />
                
                <Player
                    channel={selectedChannel}
                    onChannelChange={setSelectedChannel}
                />
            </div>
        </div>
    );
}

export default App;
