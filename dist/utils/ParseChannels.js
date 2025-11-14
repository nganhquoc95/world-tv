"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const ChannelParser_1 = __importDefault(require("../services/ChannelParser"));
const ChannelRepository_1 = __importDefault(require("../services/ChannelRepository"));
const Database_1 = __importDefault(require("./Database"));
/**
 * ParseChannels - Orchestrates parsing and storage of M3U channels
 * Uses composition and dependency injection
 * Follows Single Responsibility and Open/Closed principles
 */
class ParseChannels {
    constructor() {
        this.streamListPath = path_1.default.join(__dirname, '../..', 'data/streams/index.m3u');
        this.parser = new ChannelParser_1.default();
        this.repository = new ChannelRepository_1.default(new Database_1.default());
    }
    /**
     * Parse M3U file and cache in database if needed
     */
    async parse() {
        try {
            const fileContent = fs_1.default.readFileSync(this.streamListPath, 'utf-8');
            const channels = this.parser.parseFile(fileContent);
            // Store to database only if empty
            const hasChannels = await this.repository.hasChannels();
            if (!hasChannels) {
                await this.repository.save(channels);
            }
            return channels;
        }
        catch (error) {
            console.error('Error parsing channels:', error);
            throw error;
        }
    }
    /**
     * Delegate to repository methods
     */
    getChannels(limit, offset) {
        return this.repository.findAll(limit, offset);
    }
    searchChannels(query) {
        return this.repository.search(query);
    }
    getChannelsByCountry(countryCode) {
        return this.repository.findByCountry(countryCode);
    }
    getChannelById(tvgId) {
        return this.repository.findById(tvgId);
    }
    getChannelCount() {
        return this.repository.count();
    }
    getCountries() {
        return this.repository.getCountries();
    }
    getCategories() {
        return this.repository.getCategories();
    }
    closeDatabase() {
        this.repository.close();
    }
}
exports.default = ParseChannels;
//# sourceMappingURL=ParseChannels.js.map