import path from 'path';
import fs from 'fs';

export interface IChannelItem {
    tvgId: string;
    tvgLogo: string;
    categories: string[];
    name: string;
    countryCode: string;
    quanlity: string;
    url: string;
    httpReferrer?: string;
    httpUserAgent?: string;
}

class ParseChannels {
    private streamListPath: string;

    constructor() {
        this.streamListPath = path.join(
            __dirname,
            '../..',
            'data/streams/index.m3u'
        );
    }

    /**
     * Parse channels from the M3U stream list
     */
    public parse(): IChannelItem[] {
        const fileContent = fs.readFileSync(this.streamListPath, 'utf-8');
        const lines = fileContent.split('\n');
        const channels: IChannelItem[] = [];

        // skip 3 lines of header
        for (let i = 3, step = 0; i < lines.length; i = i + step) {
            step = 0;
            const line = lines[i].trim();
            if (line.startsWith('#EXTINF:')) {
                const infoLine = line;
                const urlLine = lines[i + 1]?.trim() || '';
                const channelItem = this.convertInfoToChannelItem(infoLine, urlLine);
                if (channelItem) {
                    channels.push(channelItem);
                }
            }

            while (i + step < lines.length && lines[i + step].trim().startsWith('#')) {
                step++;
            }
            step = Math.max(step, 1);
        }

        return channels;
    }

    private convertInfoToChannelItem(infoLine: string, urlLine: string): IChannelItem | null {
        const infoPattern = /#EXTINF:-1\s+tvg-id="([^"]*)"\s+tvg-logo="([^"]*)"\s+group-title="([^"]*)"[^,]*,(.+)$/;
        const match = infoLine.match(infoPattern);
        if (!match) {
            return null;
        }

        // Extract http-referrer and http-user-agent from the info line
        const httpReferrerMatch = infoLine.match(/http-referrer="([^"]*)"/);
        const httpUserAgentMatch = infoLine.match(/http-user-agent="([^"]*)"/);

        const [countryCode = '', quanlity = ''] = (match[1].split('.').pop() || '').split('@');

        const channelItem: IChannelItem = {
            tvgId: match[1],
            tvgLogo: match[2],
            categories: match[3].split('p'),
            name: match[4].trim(),
            countryCode,
            quanlity,
            url: urlLine,
        };

        // Add optional headers if found
        if (httpReferrerMatch) {
            channelItem.httpReferrer = httpReferrerMatch[1];
        }
        if (httpUserAgentMatch) {
            channelItem.httpUserAgent = httpUserAgentMatch[1];
        }

        return channelItem;
    }
}

export default ParseChannels;