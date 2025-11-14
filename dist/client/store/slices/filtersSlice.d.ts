export declare const setFilterCountry: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "filters/setFilterCountry">, setFilterCategory: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "filters/setFilterCategory">, setSearchQuery: import("@reduxjs/toolkit").ActionCreatorWithPayload<string, "filters/setSearchQuery">, setCurrentPage: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "filters/setCurrentPage">, setPageSize: import("@reduxjs/toolkit").ActionCreatorWithPayload<number, "filters/setPageSize">, resetFilters: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"filters/resetFilters">;
declare const _default: import("redux").Reducer<{
    filterCountry: string;
    filterCategory: string;
    searchQuery: string;
    currentPage: number;
    pageSize: number;
}>;
export default _default;
//# sourceMappingURL=filtersSlice.d.ts.map