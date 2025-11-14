export interface IChannelItem {
    tvgId: string;
    tvgLogo: string;
    groupTitle: string;
    name: string;
    countryCode: string;
    quanlity: string;
    url: string;
}
declare class ParseChannels {
    private streamListPath;
    constructor();
    /**
     * Parse channels from the M3U stream list
     */
    parse(): IChannelItem[];
    private convertInfoToChannelItem;
}
export default ParseChannels;
//# sourceMappingURL=ParseChannels.d.ts.map