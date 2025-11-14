import { useState, useMemo, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Header from './Header';
import Sidebar from './Sidebar';
import Player from './Player';
import { IChannelItem } from '../types';
import { RootState } from '../store';
import { channelsActions, countriesActions, categoriesActions } from '../store/slices';
import { setCurrentPage } from '../store/slices/filtersSlice';
import { useRequestStatus } from '../hooks/useRequestStatus';
import '../styles/App.css';

function App() {
    const dispatch = useDispatch();
    const { channels, loading: channelsLoading } = useSelector((state: RootState) => state.channels);
    const { countries } = useSelector((state: RootState) => state.countries);
    const { categories } = useSelector((state: RootState) => state.categories);
    const { filterCountry, filterCategory, searchQuery, currentPage, pageSize } = useSelector((state: RootState) => state.filters);

    const [selectedChannel, setSelectedChannel] = useState<IChannelItem | null>(null);
    const { getStatus, retry, isAnyLoading, hasAnyError } = useRequestStatus();

    // Load data on component mount
    useEffect(() => {
        dispatch(channelsActions.request());
        dispatch(countriesActions.request());
        dispatch(categoriesActions.request());
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
            const matchCountry = !filterCountry || !ch.countryCode || ch.countryCode.toUpperCase() === filterCountry.toUpperCase();
            const matchCategory = !filterCategory || !ch.categories || ch.categories.some((cat: string) => cat.toUpperCase() === filterCategory.toUpperCase());
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

    const totalPages = useMemo(() => {
        return Math.ceil(filteredChannels.length / pageSize);
    }, [filteredChannels.length, pageSize]);

    // Page change handler
    const handlePageChange = (page: number) => {
        dispatch(setCurrentPage(page));
    };

    if (channelsLoading) {
        return (
            <div className="app-loading">
                <div className="spinner"></div>
                <p>Loading channels...</p>
            </div>
        );
    }

    // Show error state with retry options
    if (hasAnyError && !isAnyLoading) {
        const channelsStatus = getStatus('channels');
        const countriesStatus = getStatus('countries');
        const categoriesStatus = getStatus('categories');

        return (
            <div className="app-error">
                <div className="error-content">
                    <h2>⚠️ Failed to Load Data</h2>
                    <div className="error-details">
                        {channelsStatus.error && (
                            <div className="error-item">
                                <span>📺 Channels: {channelsStatus.error}</span>
                                <button onClick={() => retry('channels')} className="retry-btn">
                                    Retry
                                </button>
                            </div>
                        )}
                        {countriesStatus.error && (
                            <div className="error-item">
                                <span>🌍 Countries: {countriesStatus.error}</span>
                                <button onClick={() => retry('countries')} className="retry-btn">
                                    Retry
                                </button>
                            </div>
                        )}
                        {categoriesStatus.error && (
                            <div className="error-item">
                                <span>📂 Categories: {categoriesStatus.error}</span>
                                <button onClick={() => retry('categories')} className="retry-btn">
                                    Retry
                                </button>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => {
                            retry('channels');
                            retry('countries');
                            retry('categories');
                        }}
                        className="retry-all-btn"
                    >
                        Retry All
                    </button>
                </div>
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
