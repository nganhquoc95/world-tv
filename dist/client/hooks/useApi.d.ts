import { IChannelItem, ICountry } from '../types';
/**
 * Hook for fetching channels
 */
export declare function useChannels(): {
    channels: IChannelItem[];
    loading: boolean;
    error: string | null;
};
/**
 * Hook for fetching countries
 */
export declare function useCountries(): {
    countries: ICountry[];
    loading: boolean;
    error: string | null;
};
/**
 * Hook for fetching categories
 */
export declare function useCategories(): {
    categories: string[];
    loading: boolean;
    error: string | null;
};
//# sourceMappingURL=useApi.d.ts.map