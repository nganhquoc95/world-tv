import { IChannelItem, ICountry, IStreamsResponse } from '../types';
/**
 * API Service for World TV
 */
declare class ApiService {
    private baseUrl;
    /**
     * Fetch all countries
     */
    fetchCountries(): Promise<ICountry[]>;
    /**
     * Fetch all channels with pagination
     */
    fetchChannels(page?: number, limit?: number): Promise<IStreamsResponse>;
    /**
     * Search channels
     */
    searchChannels(query: string): Promise<IChannelItem[]>;
    /**
     * Get channels by country
     */
    getChannelsByCountry(countryCode: string): Promise<IChannelItem[]>;
    /**
     * Get channels by category
     */
    getChannelsByCategory(category: string): Promise<IChannelItem[]>;
    /**
     * Get categories
     */
    fetchCategories(): Promise<string[]>;
}
declare const _default: ApiService;
export default _default;
//# sourceMappingURL=ApiService.d.ts.map