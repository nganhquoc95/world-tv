import https from 'https';
import http from 'http';
import path from 'path';
// import fs from 'fs';
import ChannelParser from '../services/ChannelParser.js';
import ChannelRepository from '../services/ChannelRepository.js';
import Database from './Database.js';
import { IChannelItem } from '../types/index.js';

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

    readFileFromUrl(fileUrl: string) {
        return new Promise((resolve, reject) => {
            try {
                const urlObj = new URL(fileUrl);
                const client = urlObj.protocol === 'https:' ? https : http;

                client.get(urlObj, (res) => {
                    if (res.statusCode !== 200) {
                        reject(new Error(`Request Failed. Status Code: ${res.statusCode}`));
                        res.resume(); // Consume response data to free memory
                        return;
                    }

                    let data = '';
                    res.setEncoding('utf8');

                    res.on('data', chunk => data += chunk);
                    res.on('end', () => resolve(data));
                }).on('error', reject);
            } catch (err) {
                reject(err);
            }
        });
    }


    /**
     * Parse M3U file and cache in database if needed
     */
    public async parse(): Promise<IChannelItem[]> {
        try {
            // const fileContent = fs.readFileSync(this.streamListPath, 'utf-8');
            const fileUrl = "https://iptv-org.github.io/iptv/index.m3u";
            const fileContent = await this.readFileFromUrl(fileUrl) as string;
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