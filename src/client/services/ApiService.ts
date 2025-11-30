import { IChannelItem, ICountry, IStreamsResponse, ICountriesResponse } from '../types';

declare const __VITE_API_URL__: string;
declare const window: any;

/**
 * Get API base URL from environment
 * Development:
 *   - Frontend: http://localhost:3001 (Vite dev server)
 *   - Server: http://localhost:3000 (Express API)
 *   - Vite proxies /api requests to :3000
 * Production:
 *   - Both on same origin
 */
const getApiUrl = (): string => {
    // For now, always use the full API URL to bypass proxy issues
    return process.env.VITE_API_URL || __VITE_API_URL__ || 'http://localhost:3000';
};

/**
 * API Service for World TV
 */
class ApiService {
    private baseUrl = getApiUrl();

    /**
     * Fetch all countries
     */
    async fetchCountries(): Promise<ICountry[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/countries`);
            const data = await response.json() as ICountriesResponse;
            return data.data || [];
        } catch (error) {
            console.error('Error fetching countries:', error);
            return [];
        }
    }

    /**
     * Fetch all channels with pagination
     */
    async fetchChannels(page: number = 1, limit: number = 10000): Promise<IStreamsResponse> {
        try {
            const response = await fetch(`${this.baseUrl}/api/streams?page=${page}&limit=${limit}`);
            const data = await response.json() as IStreamsResponse;
            return data;
        } catch (error) {
            console.error('Error fetching channels:', error);
            return {
                success: false,
                data: [],
                pagination: {
                    page: 1,
                    limit: 0,
                    total: 0,
                    pages: 0
                }
            };
        }
    }

    /**
     * Search channels
     */
    async searchChannels(query: string): Promise<IChannelItem[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/streams/search?q=${encodeURIComponent(query)}`);
            const data = await response.json() as any;
            return data.data || [];
        } catch (error) {
            console.error('Error searching channels:', error);
            return [];
        }
    }

    /**
     * Get channels by country
     */
    async getChannelsByCountry(countryCode: string): Promise<IChannelItem[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/channels/country/${countryCode}`);
            const data = await response.json() as any;
            return data.data || [];
        } catch (error) {
            console.error('Error fetching channels by country:', error);
            return [];
        }
    }

    /**
     * Get channels by category
     */
    async getChannelsByCategory(category: string): Promise<IChannelItem[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/channels/category/${category}`);
            const data = await response.json() as any;
            return data.data || [];
        } catch (error) {
            console.error('Error fetching channels by category:', error);
            return [];
        }
    }

    /**
     * Get categories
     */
    async fetchCategories(): Promise<string[]> {
        try {
            const response = await fetch(`${this.baseUrl}/api/categories`);
            const data = await response.json() as any;
            // Extract category names from category objects
            return (data.data || []).map((cat: any) => cat.name || cat);
        } catch (error) {
            console.error('Error fetching categories:', error);
            return [];
        }
    }
}

export default new ApiService();
