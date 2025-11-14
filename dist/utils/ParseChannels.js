"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
class ParseChannels {
    constructor() {
        this.streamListPath = path_1.default.join(__dirname, '../..', 'data/streams/index.m3u');
    }
    /**
     * Parse channels from the M3U stream list
     */
    parse() {
        const fileContent = fs_1.default.readFileSync(this.streamListPath, 'utf-8');
        const lines = fileContent.split('\n');
        const channels = [];
        // skip 3 lines of header
        for (let i = 3; i < lines.length; i = i + 2) {
            const line = lines[i].trim();
            if (line.startsWith('#EXTINF:')) {
                const infoLine = line;
                const urlLine = lines[i + 1]?.trim() || '';
                const channelItem = this.convertInfoToChannelItem(infoLine, urlLine);
                if (channelItem) {
                    channels.push(channelItem);
                }
            }
        }
        return channels;
    }
    convertInfoToChannelItem(infoLine, urlLine) {
        const infoPattern = /#EXTINF:-1\s+tvg-id="(.*)"\s+tvg-logo="(.*)"\s+group-title="(.*)",(.*)/;
        const match = infoLine.match(infoPattern);
        if (!match) {
            return null;
        }
        const [countryCode = '', quanlity = ''] = (match[1].split('.').pop() || '').split('@');
        return {
            tvgId: match[1],
            tvgLogo: match[2],
            groupTitle: match[3],
            name: match[4],
            countryCode,
            quanlity,
            url: urlLine,
        };
    }
}
exports.default = ParseChannels;
//# sourceMappingURL=ParseChannels.js.map