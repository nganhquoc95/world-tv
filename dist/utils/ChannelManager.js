"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelManager = void 0;
const path_1 = __importDefault(require("path"));
const csvtojson_1 = __importDefault(require("csvtojson"));
class ChannelManager {
    constructor() {
        this.channels = [];
        this.countries = [];
        this.categories = [];
        this.feeds = [];
        // Path to the database CSV files
        this.dbPath = path_1.default.join(__dirname, '../..', 'node_modules/@iptv-org/database/data');
    }
    /**
     * Load all data from CSV files
     */
    async loadData() {
        try {
            console.log('Loading data from IPTV database...');
            await Promise.all([
                this.loadChannels(),
                this.loadCountries(),
                this.loadCategories(),
                this.loadFeeds()
            ]);
            console.log(`✓ Loaded ${this.channels.length} channels`);
            console.log(`✓ Loaded ${this.countries.length} countries`);
            console.log(`✓ Loaded ${this.categories.length} categories`);
            console.log(`✓ Loaded ${this.feeds.length} feeds`);
        }
        catch (error) {
            console.error('Failed to load database:', error);
            throw error;
        }
    }
    /**
     * Load channels from CSV
     */
    async loadChannels() {
        const filePath = path_1.default.join(this.dbPath, 'channels.csv');
        const data = await (0, csvtojson_1.default)().fromFile(filePath);
        this.channels = data.map((row) => ({
            id: row.id,
            name: row.name,
            alt_names: this.parseArray(row.alt_names),
            network: row.network || undefined,
            owners: this.parseArray(row.owners),
            country: row.country,
            categories: this.parseArray(row.categories),
            is_nsfw: row.is_nsfw === 'TRUE',
            launched: row.launched || undefined,
            closed: row.closed || undefined,
            replaced_by: row.replaced_by || undefined,
            website: row.website || undefined
        }));
    }
    /**
     * Load countries from CSV
     */
    async loadCountries() {
        const filePath = path_1.default.join(this.dbPath, 'countries.csv');
        const data = await (0, csvtojson_1.default)().fromFile(filePath);
        this.countries = data.map((row) => ({
            code: row.code,
            name: row.name,
            languages: this.parseArray(row.languages),
            flag: row.flag
        }));
    }
    /**
     * Load categories from CSV
     */
    async loadCategories() {
        const filePath = path_1.default.join(this.dbPath, 'categories.csv');
        const data = await (0, csvtojson_1.default)().fromFile(filePath);
        this.categories = data.map((row) => ({
            id: row.id,
            name: row.name,
            description: row.description
        }));
    }
    /**
     * Load feeds from CSV
     */
    async loadFeeds() {
        const filePath = path_1.default.join(this.dbPath, 'feeds.csv');
        const data = await (0, csvtojson_1.default)().fromFile(filePath);
        this.feeds = data.map((row) => ({
            channel: row.channel,
            id: row.id,
            name: row.name,
            alt_names: this.parseArray(row.alt_names),
            is_main: row.is_main === 'TRUE',
            broadcast_area: this.parseArray(row.broadcast_area),
            timezones: this.parseArray(row.timezones),
            languages: this.parseArray(row.languages),
            format: row.format || undefined
        }));
    }
    /**
     * Parse semicolon-separated values from CSV
     */
    parseArray(value) {
        if (!value || value.trim() === '')
            return [];
        return value.split(';').filter(item => item.trim() !== '');
    }
    /**
     * Get all countries
     */
    getCountries() {
        return this.countries.sort((a, b) => a.name.localeCompare(b.name));
    }
    /**
     * Get all categories
     */
    getCategories() {
        return this.categories.sort((a, b) => a.name.localeCompare(b.name));
    }
    /**
     * Get channels by country code
     */
    getChannelsByCountryCode(countryCode) {
        return this.channels
            .filter(ch => ch.country === countryCode.toUpperCase())
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    /**
     * Get channels by country name
     */
    getChannelsByCountryName(countryName) {
        const country = this.countries.find(c => c.name.toLowerCase() === countryName.toLowerCase());
        if (!country) {
            return [];
        }
        return this.getChannelsByCountryCode(country.code);
    }
    /**
     * Get channels by category ID
     */
    getChannelsByCategoryId(categoryId) {
        return this.channels
            .filter(ch => ch.categories?.some(cat => cat.toLowerCase() === categoryId.toLowerCase()))
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    /**
     * Get channels by category name
     */
    getChannelsByCategoryName(categoryName) {
        const category = this.categories.find(c => c.name.toLowerCase() === categoryName.toLowerCase());
        if (!category) {
            return [];
        }
        return this.getChannelsByCategoryId(category.id);
    }
    /**
     * Search channels by name or alternative names
     */
    searchChannels(query) {
        const lowerQuery = query.toLowerCase();
        return this.channels
            .filter(ch => {
            const matchesName = ch.name.toLowerCase().includes(lowerQuery);
            const matchesAltNames = ch.alt_names?.some(alt => alt.toLowerCase().includes(lowerQuery));
            return matchesName || matchesAltNames;
        })
            .sort((a, b) => a.name.localeCompare(b.name));
    }
    /**
     * Get channel by ID
     */
    getChannelById(id) {
        return this.channels.find(ch => ch.id === id);
    }
    /**
     * Get feeds for a specific channel
     */
    getFeedsByChannelId(channelId) {
        return this.feeds.filter(feed => feed.channel === channelId);
    }
    /**
     * Get country by code
     */
    getCountryByCode(code) {
        return this.countries.find(c => c.code === code.toUpperCase());
    }
    /**
     * Get category by ID
     */
    getCategoryById(id) {
        return this.categories.find(c => c.id === id);
    }
    /**
     * Get all channels
     */
    getAllChannels() {
        return [...this.channels];
    }
}
exports.ChannelManager = ChannelManager;
exports.default = ChannelManager;
//# sourceMappingURL=ChannelManager.js.map