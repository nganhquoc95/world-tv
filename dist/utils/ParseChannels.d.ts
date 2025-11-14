import { IChannelItem } from '../types';
/**
 * ParseChannels - Orchestrates parsing and storage of M3U channels
 * Uses composition and dependency injection
 * Follows Single Responsibility and Open/Closed principles
 */
declare class ParseChannels {
    private streamListPath;
    private parser;
    private repository;
    constructor();
    /**
     * Parse M3U file and cache in database if needed
     */
    parse(): Promise<IChannelItem[]>;
    /**
     * Delegate to repository methods
     */
    getChannels(limit?: number, offset?: number): Promise<IChannelItem[]>;
    searchChannels(query: string): Promise<IChannelItem[]>;
    getChannelsByCountry(countryCode: string): Promise<IChannelItem[]>;
    getChannelById(tvgId: string): Promise<IChannelItem | null>;
    getChannelCount(): Promise<number>;
    getCountries(): Promise<string[]>;
    getCategories(): Promise<string[]>;
    closeDatabase(): void;
}
export default ParseChannels;
//# sourceMappingURL=ParseChannels.d.ts.map