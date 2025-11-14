import { IChannelItem } from '../types';
/**
 * Responsible for parsing M3U8 format and extracting channel metadata
 * Follows Single Responsibility Principle
 */
export declare class ChannelParser {
    private readonly INFO_LINE_PATTERN;
    private readonly HTTP_REFERRER_PATTERN;
    private readonly HTTP_USER_AGENT_PATTERN;
    /**
     * Parse M3U8 file content into channels
     */
    parseFile(fileContent: string): IChannelItem[];
    /**
     * Parse single EXTINF line and URL into channel object
     */
    private parseLine;
    /**
     * Extract country code and quality from tvgId (format: "country.name@quality")
     */
    private extractCountryAndQuality;
    /**
     * Parse group title into category array
     */
    private parseCategories;
    /**
     * Extract attribute value from infoLine using regex pattern
     */
    private extractAttribute;
}
export default ChannelParser;
//# sourceMappingURL=ChannelParser.d.ts.map