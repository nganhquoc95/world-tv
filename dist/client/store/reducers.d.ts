export declare const rootReducer: import("redux").Reducer<{
    channels: {
        channels: import("../types").IChannelItem[];
        countries: import("../types").ICountry[];
        categories: string[];
        loading: boolean;
        error: string | null;
    };
    filters: {
        filterCountry: string;
        filterCategory: string;
        searchQuery: string;
        currentPage: number;
        pageSize: number;
    };
}, import("redux").UnknownAction, Partial<{
    channels: {
        channels: import("../types").IChannelItem[];
        countries: import("../types").ICountry[];
        categories: string[];
        loading: boolean;
        error: string | null;
    } | undefined;
    filters: {
        filterCountry: string;
        filterCategory: string;
        searchQuery: string;
        currentPage: number;
        pageSize: number;
    } | undefined;
}>>;
export type RootState = ReturnType<typeof rootReducer>;
//# sourceMappingURL=reducers.d.ts.map