import { IChannelItem } from '../types';
declare class Database {
    private db;
    private dbPath;
    constructor();
    /**
     * Initialize database schema
     */
    private initializeSchema;
    /**
     * Check if database has any channels
     */
    hasChannels(): Promise<boolean>;
    /**
     * Store channels to database
     */
    storeChannels(channels: IChannelItem[]): Promise<void>;
    /**
     * Get all channels from database
     */
    getAllChannels(limit?: number, offset?: number): Promise<IChannelItem[]>;
    /**
     * Get channels by country code
     */
    getChannelsByCountry(countryCode: string): Promise<IChannelItem[]>;
    /**
     * Search channels by name or category
     */
    searchChannels(query: string): Promise<IChannelItem[]>;
    /**
     * Get channel by tvgId
     */
    getChannelById(tvgId: string): Promise<IChannelItem | null>;
    /**
     * Get total channel count
     */
    getChannelCount(): Promise<number>;
    /**
     * Get unique countries
     */
    getCountries(): Promise<string[]>;
    /**
     * Get unique categories
     */
    getCategories(): Promise<string[]>;
    /**
     * Close database connection
     */
    close(): void;
}
export default Database;
//# sourceMappingURL=Database.d.ts.map