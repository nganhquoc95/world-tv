"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChannelParser = void 0;
/**
 * Responsible for parsing M3U8 format and extracting channel metadata
 * Follows Single Responsibility Principle
 */
class ChannelParser {
    constructor() {
        this.INFO_LINE_PATTERN = /#EXTINF:-1\s+tvg-id="([^"]*)"\s+tvg-logo="([^"]*)"\s+group-title="([^"]*)"[^,]*,(.+)$/;
        this.HTTP_REFERRER_PATTERN = /http-referrer="([^"]*)"/;
        this.HTTP_USER_AGENT_PATTERN = /http-user-agent="([^"]*)"/;
    }
    /**
     * Parse M3U8 file content into channels
     */
    parseFile(fileContent) {
        const lines = fileContent.split('\n');
        const channels = [];
        // Skip 3-line header
        for (let i = 3, step = 0; i < lines.length; i = i + step) {
            step = 0;
            const line = lines[i].trim();
            if (line.startsWith('#EXTINF:')) {
                const urlLine = lines[i + 1]?.trim() || '';
                const channel = this.parseLine(line, urlLine);
                if (channel) {
                    channels.push(channel);
                }
            }
            // Skip additional metadata lines
            while (i + step < lines.length && lines[i + step].trim().startsWith('#')) {
                step++;
            }
            step = Math.max(step, 1);
        }
        return channels;
    }
    /**
     * Parse single EXTINF line and URL into channel object
     */
    parseLine(infoLine, urlLine) {
        const match = infoLine.match(this.INFO_LINE_PATTERN);
        if (!match) {
            return null;
        }
        const [tvgId, tvgLogo, groupTitle, name] = [match[1], match[2], match[3], match[4].trim()];
        const { countryCode, quality } = this.extractCountryAndQuality(tvgId);
        const channel = {
            tvgId,
            tvgLogo,
            categories: this.parseCategories(groupTitle),
            name,
            countryCode,
            quanlity: quality,
            url: urlLine,
        };
        // Extract optional headers
        const httpReferrer = this.extractAttribute(infoLine, this.HTTP_REFERRER_PATTERN);
        const httpUserAgent = this.extractAttribute(infoLine, this.HTTP_USER_AGENT_PATTERN);
        if (httpReferrer)
            channel.httpReferrer = httpReferrer;
        if (httpUserAgent)
            channel.httpUserAgent = httpUserAgent;
        return channel;
    }
    /**
     * Extract country code and quality from tvgId (format: "country.name@quality")
     */
    extractCountryAndQuality(tvgId) {
        const [countryCode = '', quality = ''] = (tvgId.split('.').pop() || '').split('@');
        return { countryCode, quality };
    }
    /**
     * Parse group title into category array
     */
    parseCategories(groupTitle) {
        return groupTitle.split('p').filter(cat => cat.length > 0);
    }
    /**
     * Extract attribute value from infoLine using regex pattern
     */
    extractAttribute(infoLine, pattern) {
        const match = infoLine.match(pattern);
        return match ? match[1] : null;
    }
}
exports.ChannelParser = ChannelParser;
exports.default = ChannelParser;
//# sourceMappingURL=ChannelParser.js.map