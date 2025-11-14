import Database from '../utils/Database';
import { IChannelItem } from '../types';
import Model from './Model';

/**
 * ChannelModel - Data access layer for channel operations
 * Extends base Model class for common database functionality
 * Provides clean interface for querying channels from SQLite database
 * Handles filtering, pagination, and data transformation
 */
class ChannelModel extends Model {
    constructor() {
        super(new Database());
    }

    /**
     * Get channels with optional filtering and pagination
     */
    async getChannels(options: {
        limit?: number;
        offset?: number;
        country?: string;
        category?: string;
    } = {}): Promise<{
        channels: IChannelItem[];
        total: number;
        hasMore: boolean;
    }> {
        const { limit = 50, offset = 0, country, category } = options;

        return this.executeQuery(async () => {
            let channels: IChannelItem[];
            let total: number;

            if (country && category) {
                // Filter by both country and category
                const countryChannels = await this.database.getChannelsByCountry(country);
                channels = countryChannels.filter((ch: IChannelItem) =>
                    ch.categories?.some((cat: string) => cat.toLowerCase() === category.toLowerCase())
                );
                total = channels.length;
                channels = channels.slice(offset, offset + limit);
            } else if (country) {
                // Filter by country only
                channels = await this.database.getChannelsByCountry(country);
                total = channels.length;
                channels = channels.slice(offset, offset + limit);
            } else if (category) {
                // Filter by category only
                const allChannels = await this.database.getAllChannels();
                channels = allChannels.filter((ch: IChannelItem) =>
                    ch.categories?.some((cat: string) => cat.toLowerCase() === category.toLowerCase())
                );
                total = channels.length;
                channels = channels.slice(offset, offset + limit);
            } else {
                // No filters - get all channels with pagination
                channels = await this.database.getAllChannels(limit, offset);
                total = await this.database.getChannelCount();
            }

            const hasMore = offset + channels.length < total;

            return {
                channels,
                total,
                hasMore
            };
        }, 'ChannelModel.getChannels');
    }

    /**
     * Search channels by query
     */
    async searchChannels(query: string, options: {
        limit?: number;
        offset?: number;
    } = {}): Promise<{
        channels: IChannelItem[];
        total: number;
        hasMore: boolean;
    }> {
        const { limit = 50, offset = 0 } = options;

        return this.executeQuery(async () => {
            const allResults = await this.database.searchChannels(query);
            const total = allResults.length;
            const channels = allResults.slice(offset, offset + limit);
            const hasMore = offset + channels.length < total;

            return {
                channels,
                total,
                hasMore
            };
        }, 'ChannelModel.searchChannels');
    }

    /**
     * Get channel by ID
     */
    async getChannelById(tvgId: string): Promise<IChannelItem | null> {
        return this.executeQuery(async () => {
            return await this.database.getChannelById(tvgId);
        }, 'ChannelModel.getChannelById');
    }

    /**
     * Get channels by country
     */
    async getChannelsByCountry(countryCode: string, options: {
        limit?: number;
        offset?: number;
    } = {}): Promise<{
        channels: IChannelItem[];
        total: number;
        hasMore: boolean;
    }> {
        const { limit = 50, offset = 0 } = options;

        return this.executeQuery(async () => {
            const channels = await this.database.getChannelsByCountry(countryCode);
            const total = channels.length;
            const paginatedChannels = channels.slice(offset, offset + limit);
            const hasMore = offset + paginatedChannels.length < total;

            return {
                channels: paginatedChannels,
                total,
                hasMore
            };
        }, 'ChannelModel.getChannelsByCountry');
    }

    /**
     * Get unique countries
     */
    async getCountries(): Promise<string[]> {
        return this.executeQuery(async () => {
            return await this.database.getCountries();
        }, 'ChannelModel.getCountries');
    }

    /**
     * Get unique categories
     */
    async getCategories(): Promise<string[]> {
        return this.executeQuery(async () => {
            return await this.database.getCategories();
        }, 'ChannelModel.getCategories');
    }

    /**
     * Get total channel count
     */
    async getChannelCount(): Promise<number> {
        return this.executeQuery(async () => {
            return await this.database.getChannelCount();
        }, 'ChannelModel.getChannelCount');
    }

    /**
     * Check if channels exist in database
     */
    async hasChannels(): Promise<boolean> {
        return this.executeQuery(async () => {
            return await this.database.hasChannels();
        }, 'ChannelModel.hasChannels');
    }
}

export default ChannelModel;