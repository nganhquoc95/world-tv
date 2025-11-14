import { IChannelItem } from '../types';
import '../styles/Sidebar.css';

interface SidebarProps {
    channels: IChannelItem[];
    selectedChannel: IChannelItem | null;
    setSelectedChannel: (channel: IChannelItem) => void;
    filteredCount: number;
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    channelCount: number;
    groupCount: number;
}

function Sidebar({
    channels,
    selectedChannel,
    setSelectedChannel,
    filteredCount,
    currentPage,
    totalPages,
    onPageChange,
    channelCount,
    groupCount
}: SidebarProps) {
    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <div className="sidebar-search">
                    <input
                        type="text"
                        placeholder="Search channels..."
                        className="search-box"
                    />
                </div>
            </div>

            <div className="channels-info">
                <span>Selected: <strong>{filteredCount}</strong></span>
            </div>

            <div className="stats-bar">
                <div className="stat">
                    Total: <span className="stat-value">{channelCount.toLocaleString()}</span>
                </div>
                <div className="stat">
                    Groups: <span className="stat-value">{groupCount}</span>
                </div>
            </div>

            <div className="sidebar-content" id="channelsList">
                {channels.length === 0 ? (
                    <div className="empty">No channels found</div>
                ) : (
                    <div className="channels-list">
                        {channels.map(channel => (
                            <div
                                key={channel.tvgId}
                                className={`channel-item ${selectedChannel?.tvgId === channel.tvgId ? 'active' : ''}`}
                                onClick={() => setSelectedChannel(channel)}
                            >
                                {channel.tvgLogo && (
                                    <img
                                        src={channel.tvgLogo}
                                        alt={channel.name}
                                        className="channel-logo"
                                    />
                                )}
                                <div className="channel-info">
                                    <div className="channel-name">{channel.name}</div>
                                    <div className="channel-meta">
                                        {channel.countryCode && (
                                            <span className="channel-country">{channel.countryCode.toUpperCase()}</span>
                                        )}
                                        {channel.quanlity && (
                                            <span className="channel-quality">{channel.quanlity}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        className="btn btn-primary"
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span className="pagination-info">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        className="btn btn-primary"
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default Sidebar;
