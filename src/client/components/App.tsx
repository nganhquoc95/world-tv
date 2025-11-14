import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Player from './Player';
import { IChannelItem } from '../types';
import { RootState } from '../store';
import { fetchChannels, fetchCountries, fetchCategories } from '../store/actions';
import { setCurrentPage } from '../store/slices/filtersSlice';
import '../styles/App.css';

function App() {
    const dispatch = useDispatch();
    const { channels, countries, categories, loading } = useSelector((state: RootState) => state.channels);
    const { filterCountry, filterCategory, searchQuery, currentPage, pageSize } = useSelector((state: RootState) => state.filters);

    const [selectedChannel, setSelectedChannel] = useState<IChannelItem | null>(null);

    // Load data on component mount
    useEffect(() => {
        dispatch(fetchChannels());
        dispatch(fetchCountries());
        dispatch(fetchCategories());
    }, [dispatch]);

    // Create country name map
    const countryNameMap = useMemo(() => {
        const map: Record<string, string> = {};
        countries.forEach((country: any) => {
            map[country.code] = country.name;
        });
        return map;
    }, [countries]);

    // Extract unique groups from channels
    const groups = useMemo(() => {
        const groupSet = new Set<string>();
        channels.forEach((ch: any) => {
            if (ch.groupTitle) groupSet.add(ch.groupTitle);
        });
        return Array.from(groupSet).sort();
    }, [channels]);

    // Filter channels
    const filteredChannels = useMemo(() => {
        return channels.filter((ch: any) => {
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

    // Page change handler
    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
    };    if (loading) {
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
                categories={categories}
            />

            <div className="main-container">
                <Sidebar
                    channels={paginatedChannels}
                    selectedChannel={selectedChannel}
                    setSelectedChannel={setSelectedChannel}
                    filteredCount={filteredChannels.length}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                    channelCount={channels.length}
                    groupCount={groups.length}
                />

                <Player
                    channel={selectedChannel}
                />
            </div>
        </div>
    );
}

export default App;
