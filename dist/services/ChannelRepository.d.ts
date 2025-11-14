import Database from '../utils/Database';
import { IChannelItem } from '../types';
/**
 * Repository pattern for channel data persistence
 * Abstracts database operations and provides clean interface
 * Follows Single Responsibility and Dependency Inversion principles
 */
export declare class ChannelRepository {
    private database;
    constructor(database: Database);
    /**
     * Check if channels exist in database
     */
    hasChannels(): Promise<boolean>;
    /**
     * Store channels to database
     */
    save(channels: IChannelItem[]): Promise<void>;
    /**
     * Get paginated channels
     */
    findAll(limit?: number, offset?: number): Promise<IChannelItem[]>;
    /**
     * Find channel by ID
     */
    findById(tvgId: string): Promise<IChannelItem | null>;
    /**
     * Find channels by country code
     */
    findByCountry(countryCode: string): Promise<IChannelItem[]>;
    /**
     * Search channels by query
     */
    search(query: string): Promise<IChannelItem[]>;
    /**
     * Get total channel count
     */
    count(): Promise<number>;
    /**
     * Get unique country codes
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
export default ChannelRepository;
//# sourceMappingURL=ChannelRepository.d.ts.map