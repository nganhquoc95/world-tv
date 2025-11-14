import { rootReducer } from './reducers';
declare const store: import("@reduxjs/toolkit").EnhancedStore<{
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
}, import("redux").UnknownAction, import("@reduxjs/toolkit").Tuple<[import("redux").StoreEnhancer<{
    dispatch: {};
}>, import("redux").StoreEnhancer]>>;
export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;
export default store;
//# sourceMappingURL=index.d.ts.map