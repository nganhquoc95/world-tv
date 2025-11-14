/**
 * Channel item interface
 */
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
    groupTitle?: string;
}

/**
 * Country interface
 */
export interface ICountry {
    code: string;
    name: string;
    languages: string;
    flag: string;
}

/**
 * API response interface
 */
export interface IApiResponse<T> {
    success: boolean;
    data?: T;
    count?: number;
    pagination?: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
    message?: string;
    error?: string;
}

/**
 * Stream channels API response
 */
export interface IStreamsResponse extends IApiResponse<IChannelItem[]> {
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

/**
 * Countries API response
 */
export interface ICountriesResponse extends IApiResponse<ICountry[]> {
    count: number;
}
