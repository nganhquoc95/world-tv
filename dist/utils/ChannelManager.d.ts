import { IChannel, ICountry, ICategory, IFeed } from '../types';
export declare class ChannelManager {
    private channels;
    private countries;
    private categories;
    private feeds;
    private dbPath;
    constructor();
    /**
     * Load all data from CSV files
     */
    loadData(): Promise<void>;
    /**
     * Load channels from CSV
     */
    private loadChannels;
    /**
     * Load countries from CSV
     */
    private loadCountries;
    /**
     * Load categories from CSV
     */
    private loadCategories;
    /**
     * Load feeds from CSV
     */
    private loadFeeds;
    /**
     * Parse semicolon-separated values from CSV
     */
    private parseArray;
    /**
     * Get all countries
     */
    getCountries(): ICountry[];
    /**
     * Get all categories
     */
    getCategories(): ICategory[];
    /**
     * Get channels by country code
     */
    getChannelsByCountryCode(countryCode: string): IChannel[];
    /**
     * Get channels by country name
     */
    getChannelsByCountryName(countryName: string): IChannel[];
    /**
     * Get channels by category ID
     */
    getChannelsByCategoryId(categoryId: string): IChannel[];
    /**
     * Get channels by category name
     */
    getChannelsByCategoryName(categoryName: string): IChannel[];
    /**
     * Search channels by name or alternative names
     */
    searchChannels(query: string): IChannel[];
    /**
     * Get channel by ID
     */
    getChannelById(id: string): IChannel | undefined;
    /**
     * Get feeds for a specific channel
     */
    getFeedsByChannelId(channelId: string): IFeed[];
    /**
     * Get country by code
     */
    getCountryByCode(code: string): ICountry | undefined;
    /**
     * Get category by ID
     */
    getCategoryById(id: string): ICategory | undefined;
    /**
     * Get all channels
     */
    getAllChannels(): IChannel[];
}
export default ChannelManager;
//# sourceMappingURL=ChannelManager.d.ts.map