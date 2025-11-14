import Database from '../utils/Database';
import { IChannelItem } from '../types';

/**
 * Repository pattern for channel data persistence
 * Abstracts database operations and provides clean interface
 * Follows Single Responsibility and Dependency Inversion principles
 */
export class ChannelRepository {
    constructor(private database: Database) {}

    /**
     * Check if channels exist in database
     */
    async hasChannels(): Promise<boolean> {
        return this.database.hasChannels();
    }

    /**
     * Store channels to database
     */
    async save(channels: IChannelItem[]): Promise<void> {
        return this.database.storeChannels(channels);
    }

    /**
     * Get paginated channels
     */
    async findAll(limit?: number, offset?: number): Promise<IChannelItem[]> {
        return this.database.getAllChannels(limit, offset);
    }

    /**
     * Find channel by ID
     */
    async findById(tvgId: string): Promise<IChannelItem | null> {
        return this.database.getChannelById(tvgId);
    }

    /**
     * Find channels by country code
     */
    async findByCountry(countryCode: string): Promise<IChannelItem[]> {
        return this.database.getChannelsByCountry(countryCode);
    }

    /**
     * Search channels by query
     */
    async search(query: string): Promise<IChannelItem[]> {
        return this.database.searchChannels(query);
    }

    /**
     * Get total channel count
     */
    async count(): Promise<number> {
        return this.database.getChannelCount();
    }

    /**
     * Get unique country codes
     */
    async getCountries(): Promise<string[]> {
        return this.database.getCountries();
    }

    /**
     * Get unique categories
     */
    async getCategories(): Promise<string[]> {
        return this.database.getCategories();
    }

    /**
     * Close database connection
     */
    close(): void {
        this.database.close();
    }
}

export default ChannelRepository;
