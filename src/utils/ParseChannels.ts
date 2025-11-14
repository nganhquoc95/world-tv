import path from 'path';
import fs from 'fs';
import ChannelParser from '../services/ChannelParser';
import ChannelRepository from '../services/ChannelRepository';
import Database from './Database';
import { IChannelItem } from '../types';

/**
 * ParseChannels - Orchestrates parsing and storage of M3U channels
 * Uses composition and dependency injection
 * Follows Single Responsibility and Open/Closed principles
 */
class ParseChannels {
    private streamListPath: string;
    private parser: ChannelParser;
    private repository: ChannelRepository;

    constructor() {
        this.streamListPath = path.join(
            __dirname,
            '../..',
            'data/streams/index.m3u'
        );
        this.parser = new ChannelParser();
        this.repository = new ChannelRepository(new Database());
    }

    /**
     * Parse M3U file and cache in database if needed
     */
    public async parse(): Promise<IChannelItem[]> {
        try {
            const fileContent = fs.readFileSync(this.streamListPath, 'utf-8');
            const channels = this.parser.parseFile(fileContent);

            // Store to database only if empty
            const hasChannels = await this.repository.hasChannels();
            if (!hasChannels) {
                await this.repository.save(channels);
            }

            return channels;
        } catch (error) {
            console.error('Error parsing channels:', error);
            throw error;
        }
    }

    /**
     * Delegate to repository methods
     */
    public getChannels(limit?: number, offset?: number): Promise<IChannelItem[]> {
        return this.repository.findAll(limit, offset);
    }

    public searchChannels(query: string): Promise<IChannelItem[]> {
        return this.repository.search(query);
    }

    public getChannelsByCountry(countryCode: string): Promise<IChannelItem[]> {
        return this.repository.findByCountry(countryCode);
    }

    public getChannelById(tvgId: string): Promise<IChannelItem | null> {
        return this.repository.findById(tvgId);
    }

    public getChannelCount(): Promise<number> {
        return this.repository.count();
    }

    public getCountries(): Promise<string[]> {
        return this.repository.getCountries();
    }

    public getCategories(): Promise<string[]> {
        return this.repository.getCategories();
    }

    public closeDatabase(): void {
        this.repository.close();
    }
}

export default ParseChannels;