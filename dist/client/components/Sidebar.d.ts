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
declare function Sidebar({ channels, selectedChannel, setSelectedChannel, filteredCount, currentPage, totalPages, onPageChange, channelCount, groupCount }: SidebarProps): import("react/jsx-runtime").JSX.Element;
export default Sidebar;
//# sourceMappingURL=Sidebar.d.ts.map