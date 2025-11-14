"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelRepository = void 0;
/**
 * Repository pattern for channel data persistence
 * Abstracts database operations and provides clean interface
 * Follows Single Responsibility and Dependency Inversion principles
 */
class ChannelRepository {
    constructor(database) {
        this.database = database;
    }
    /**
     * Check if channels exist in database
     */
    async hasChannels() {
        return this.database.hasChannels();
    }
    /**
     * Store channels to database
     */
    async save(channels) {
        return this.database.storeChannels(channels);
    }
    /**
     * Get paginated channels
     */
    async findAll(limit, offset) {
        return this.database.getAllChannels(limit, offset);
    }
    /**
     * Find channel by ID
     */
    async findById(tvgId) {
        return this.database.getChannelById(tvgId);
    }
    /**
     * Find channels by country code
     */
    async findByCountry(countryCode) {
        return this.database.getChannelsByCountry(countryCode);
    }
    /**
     * Search channels by query
     */
    async search(query) {
        return this.database.searchChannels(query);
    }
    /**
     * Get total channel count
     */
    async count() {
        return this.database.getChannelCount();
    }
    /**
     * Get unique country codes
     */
    async getCountries() {
        return this.database.getCountries();
    }
    /**
     * Get unique categories
     */
    async getCategories() {
        return this.database.getCategories();
    }
    /**
     * Close database connection
     */
    close() {
        this.database.close();
    }
}
exports.ChannelRepository = ChannelRepository;
exports.default = ChannelRepository;
//# sourceMappingURL=ChannelRepository.js.map