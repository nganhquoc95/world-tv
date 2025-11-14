"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sqlite3_1 = __importDefault(require("sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class Database {
    constructor() {
        this.dbPath = path_1.default.join(__dirname, '../..', 'data/streams.db');
        // Ensure data directory exists
        const dataDir = path_1.default.dirname(this.dbPath);
        if (!fs_1.default.existsSync(dataDir)) {
            fs_1.default.mkdirSync(dataDir, { recursive: true });
        }
        this.db = new sqlite3_1.default.Database(this.dbPath, (err) => {
            if (err) {
                console.error('Error opening database:', err);
            }
        });
        this.initializeSchema();
    }
    /**
     * Initialize database schema
     */
    initializeSchema() {
        this.db.serialize(() => {
            // Create channels table if it doesn't exist
            this.db.run(`
                CREATE TABLE IF NOT EXISTS channels (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    tvgId TEXT UNIQUE NOT NULL,
                    tvgLogo TEXT,
                    name TEXT NOT NULL,
                    countryCode TEXT,
                    quality TEXT,
                    url TEXT NOT NULL,
                    httpReferrer TEXT,
                    httpUserAgent TEXT,
                    categories TEXT,
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `);
            // Create index on tvgId for faster lookups
            this.db.run(`
                CREATE INDEX IF NOT EXISTS idx_channels_tvgId ON channels(tvgId)
            `);
            // Create index on countryCode for filtering
            this.db.run(`
                CREATE INDEX IF NOT EXISTS idx_channels_countryCode ON channels(countryCode)
            `);
            // Create index on name for search
            this.db.run(`
                CREATE INDEX IF NOT EXISTS idx_channels_name ON channels(name)
            `);
        });
    }
    /**
     * Check if database has any channels
     */
    async hasChannels() {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT COUNT(*) as count FROM channels LIMIT 1', (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve((row?.count || 0) > 0);
                }
            });
        });
    }
    /**
     * Store channels to database
     */
    async storeChannels(channels) {
        return new Promise((resolve, reject) => {
            this.db.serialize(() => {
                // Clear existing channels
                this.db.run('DELETE FROM channels', (err) => {
                    if (err) {
                        console.error('Error clearing channels:', err);
                        reject(err);
                        return;
                    }
                    // Insert new channels using INSERT OR IGNORE to handle duplicates gracefully
                    const stmt = this.db.prepare(`
                        INSERT OR IGNORE INTO channels (tvgId, tvgLogo, name, countryCode, quality, url, httpReferrer, httpUserAgent, categories)
                        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                    `);
                    let inserted = 0;
                    let errors = 0;
                    channels.forEach((channel) => {
                        stmt.run(channel.tvgId, channel.tvgLogo, channel.name, channel.countryCode, channel.quanlity, channel.url, channel.httpReferrer || null, channel.httpUserAgent || null, JSON.stringify(channel.categories || []), (err) => {
                            if (err) {
                                errors++;
                            }
                            else {
                                inserted++;
                            }
                        });
                    });
                    stmt.finalize((err) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            console.log(`✓ Stored ${inserted} channels to SQLite (${errors} duplicates skipped)`);
                            resolve();
                        }
                    });
                });
            });
        });
    }
    /**
     * Get all channels from database
     */
    async getAllChannels(limit, offset) {
        return new Promise((resolve, reject) => {
            let query = 'SELECT * FROM channels ORDER BY name ASC';
            let params = [];
            if (limit) {
                query += ' LIMIT ?';
                params.push(limit);
            }
            if (offset) {
                query += ' OFFSET ?';
                params.push(offset);
            }
            this.db.all(query, params, (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const channels = (rows || []).map(row => ({
                        tvgId: row.tvgId,
                        tvgLogo: row.tvgLogo,
                        categories: JSON.parse(row.categories || '[]'),
                        name: row.name,
                        countryCode: row.countryCode,
                        quanlity: row.quality,
                        url: row.url,
                        httpReferrer: row.httpReferrer,
                        httpUserAgent: row.httpUserAgent,
                    }));
                    resolve(channels);
                }
            });
        });
    }
    /**
     * Get channels by country code
     */
    async getChannelsByCountry(countryCode) {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT * FROM channels WHERE countryCode = ? ORDER BY name ASC', [countryCode], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const channels = (rows || []).map(row => ({
                        tvgId: row.tvgId,
                        tvgLogo: row.tvgLogo,
                        categories: JSON.parse(row.categories || '[]'),
                        name: row.name,
                        countryCode: row.countryCode,
                        quanlity: row.quality,
                        url: row.url,
                        httpReferrer: row.httpReferrer,
                        httpUserAgent: row.httpUserAgent,
                    }));
                    resolve(channels);
                }
            });
        });
    }
    /**
     * Search channels by name or category
     */
    async searchChannels(query) {
        return new Promise((resolve, reject) => {
            const searchTerm = `%${query}%`;
            this.db.all(`SELECT * FROM channels 
                 WHERE name LIKE ? OR categories LIKE ? 
                 ORDER BY name ASC`, [searchTerm, searchTerm], (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const channels = (rows || []).map(row => ({
                        tvgId: row.tvgId,
                        tvgLogo: row.tvgLogo,
                        categories: JSON.parse(row.categories || '[]'),
                        name: row.name,
                        countryCode: row.countryCode,
                        quanlity: row.quality,
                        url: row.url,
                        httpReferrer: row.httpReferrer,
                        httpUserAgent: row.httpUserAgent,
                    }));
                    resolve(channels);
                }
            });
        });
    }
    /**
     * Get channel by tvgId
     */
    async getChannelById(tvgId) {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT * FROM channels WHERE tvgId = ?', [tvgId], (err, row) => {
                if (err) {
                    reject(err);
                }
                else if (!row) {
                    resolve(null);
                }
                else {
                    const channel = {
                        tvgId: row.tvgId,
                        tvgLogo: row.tvgLogo,
                        categories: JSON.parse(row.categories || '[]'),
                        name: row.name,
                        countryCode: row.countryCode,
                        quanlity: row.quality,
                        url: row.url,
                        httpReferrer: row.httpReferrer,
                        httpUserAgent: row.httpUserAgent,
                    };
                    resolve(channel);
                }
            });
        });
    }
    /**
     * Get total channel count
     */
    async getChannelCount() {
        return new Promise((resolve, reject) => {
            this.db.get('SELECT COUNT(*) as count FROM channels', (err, row) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(row?.count || 0);
                }
            });
        });
    }
    /**
     * Get unique countries
     */
    async getCountries() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT DISTINCT countryCode FROM channels WHERE countryCode IS NOT NULL ORDER BY countryCode ASC', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve((rows || []).map(row => row.countryCode));
                }
            });
        });
    }
    /**
     * Get unique categories
     */
    async getCategories() {
        return new Promise((resolve, reject) => {
            this.db.all('SELECT DISTINCT categories FROM channels WHERE categories IS NOT NULL', (err, rows) => {
                if (err) {
                    reject(err);
                }
                else {
                    const categories = new Set();
                    (rows || []).forEach(row => {
                        try {
                            const cats = JSON.parse(row.categories || '[]');
                            cats.forEach((cat) => {
                                if (cat)
                                    categories.add(cat);
                            });
                        }
                        catch (e) {
                            // Skip invalid JSON
                        }
                    });
                    resolve(Array.from(categories).sort());
                }
            });
        });
    }
    /**
     * Close database connection
     */
    close() {
        this.db.close((err) => {
            if (err) {
                console.error('Error closing database:', err);
            }
        });
    }
}
exports.default = Database;
//# sourceMappingURL=Database.js.map