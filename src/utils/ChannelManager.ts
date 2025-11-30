import path from 'path';
import { default as csvtojson } from 'csvtojson';
import { IChannel, ICountry, ICategory, IFeed } from '../types';

export class ChannelManager {
  private channels: IChannel[] = [];
  private countries: ICountry[] = [];
  private categories: ICategory[] = [];
  private feeds: IFeed[] = [];
  private dbPath: string;

  constructor() {
    // Path to the database CSV files
    this.dbPath = path.join(
      __dirname,
      '../..',
      'node_modules/@nganhquoc95/database/data'
    );
  }

  /**
   * Load all data from CSV files
   */
  async loadData(): Promise<void> {
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
    } catch (error) {
      console.error('Failed to load database:', error);
      throw error;
    }
  }

  /**
   * Load channels from CSV
   */
  private async loadChannels(): Promise<void> {
    const filePath = path.join(this.dbPath, 'channels.csv');
    const data = await csvtojson().fromFile(filePath);
    this.channels = data.map((row: any) => ({
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
  private async loadCountries(): Promise<void> {
    const filePath = path.join(this.dbPath, 'countries.csv');
    const data = await csvtojson().fromFile(filePath);
    this.countries = data.map((row: any) => ({
      code: row.code,
      name: row.name,
      languages: this.parseArray(row.languages),
      flag: row.flag
    }));
  }

  /**
   * Load categories from CSV
   */
  private async loadCategories(): Promise<void> {
    const filePath = path.join(this.dbPath, 'categories.csv');
    const data = await csvtojson().fromFile(filePath);
    this.categories = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description
    }));
  }

  /**
   * Load feeds from CSV
   */
  private async loadFeeds(): Promise<void> {
    const filePath = path.join(this.dbPath, 'feeds.csv');
    const data = await csvtojson().fromFile(filePath);
    this.feeds = data.map((row: any) => ({
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
  private parseArray(value: string | undefined): string[] {
    if (!value || value.trim() === '') return [];
    return value.split(';').filter(item => item.trim() !== '');
  }

  /**
   * Get all countries
   */
  getCountries(): ICountry[] {
    return this.countries.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get all categories
   */
  getCategories(): ICategory[] {
    return this.categories.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get channels by country code
   */
  getChannelsByCountryCode(countryCode: string): IChannel[] {
    return this.channels
      .filter(ch => ch.country === countryCode.toUpperCase())
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get channels by country name
   */
  getChannelsByCountryName(countryName: string): IChannel[] {
    const country = this.countries.find(c =>
      c.name.toLowerCase() === countryName.toLowerCase()
    );

    if (!country) {
      return [];
    }

    return this.getChannelsByCountryCode(country.code);
  }

  /**
   * Get channels by category ID
   */
  getChannelsByCategoryId(categoryId: string): IChannel[] {
    return this.channels
      .filter(ch => 
        ch.categories?.some(cat => cat.toLowerCase() === categoryId.toLowerCase())
      )
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get channels by category name
   */
  getChannelsByCategoryName(categoryName: string): IChannel[] {
    const category = this.categories.find(c =>
      c.name.toLowerCase() === categoryName.toLowerCase()
    );

    if (!category) {
      return [];
    }

    return this.getChannelsByCategoryId(category.id);
  }

  /**
   * Search channels by name or alternative names
   */
  searchChannels(query: string): IChannel[] {
    const lowerQuery = query.toLowerCase();
    return this.channels
      .filter(ch => {
        const matchesName = ch.name.toLowerCase().includes(lowerQuery);
        const matchesAltNames = ch.alt_names?.some(alt =>
          alt.toLowerCase().includes(lowerQuery)
        );
        return matchesName || matchesAltNames;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Get channel by ID
   */
  getChannelById(id: string): IChannel | undefined {
    return this.channels.find(ch => ch.id === id);
  }

  /**
   * Get feeds for a specific channel
   */
  getFeedsByChannelId(channelId: string): IFeed[] {
    return this.feeds.filter(feed => feed.channel === channelId);
  }

  /**
   * Get country by code
   */
  getCountryByCode(code: string): ICountry | undefined {
    return this.countries.find(c => c.code === code.toUpperCase());
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: string): ICategory | undefined {
    return this.categories.find(c => c.id === id);
  }

  /**
   * Get all channels
   */
  getAllChannels(): IChannel[] {
    return [...this.channels];
  }
}

export default ChannelManager;
