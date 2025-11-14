/**
 * Channel interface based on @iptv-org/database structure
 */
export interface IChannel {
    id: string;
    name: string;
    alt_names?: string[];
    network?: string;
    owners?: string[];
    country: string;
    categories?: string[];
    is_nsfw: boolean;
    launched?: string;
    closed?: string;
    replaced_by?: string;
    website?: string;
}
/**
 * Country interface based on @iptv-org/database structure
 */
export interface ICountry {
    code: string;
    name: string;
    languages: string[];
    flag: string;
}
/**
 * Category interface based on @iptv-org/database structure
 */
export interface ICategory {
    id: string;
    name: string;
    description: string;
}
/**
 * Feed interface based on @iptv-org/database structure
 */
export interface IFeed {
    channel: string;
    id: string;
    name: string;
    alt_names?: string[];
    is_main: boolean;
    broadcast_area?: string[];
    timezones?: string[];
    languages?: string[];
    format?: string;
}
/**
 * API Response wrapper for consistent responses
 */
export interface ApiResponse<T> {
    success: boolean;
    error?: string;
    data?: T;
    count?: number;
    message?: string;
}
/**
 * Pagination metadata
 */
export interface PaginationInfo {
    page: number;
    limit: number;
    total: number;
    pages: number;
}
/**
 * API Response with pagination
 */
export interface PaginatedResponse<T> extends ApiResponse<T> {
    pagination?: PaginationInfo;
}
//# sourceMappingURL=index.d.ts.map