"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetFilters = exports.setPageSize = exports.setCurrentPage = exports.setSearchQuery = exports.setFilterCategory = exports.setFilterCountry = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    filterCountry: '',
    filterCategory: '',
    searchQuery: '',
    currentPage: 1,
    pageSize: 50,
};
const filtersSlice = (0, toolkit_1.createSlice)({
    name: 'filters',
    initialState,
    reducers: {
        setFilterCountry: (state, action) => {
            state.filterCountry = action.payload;
            state.currentPage = 1; // Reset to first page when filter changes
        },
        setFilterCategory: (state, action) => {
            state.filterCategory = action.payload;
            state.currentPage = 1; // Reset to first page when filter changes
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
            state.currentPage = 1; // Reset to first page when search changes
        },
        setCurrentPage: (state, action) => {
            state.currentPage = action.payload;
        },
        setPageSize: (state, action) => {
            state.pageSize = action.payload;
            state.currentPage = 1; // Reset to first page when page size changes
        },
        resetFilters: (state) => {
            state.filterCountry = '';
            state.filterCategory = '';
            state.searchQuery = '';
            state.currentPage = 1;
        },
    },
});
_a = filtersSlice.actions, exports.setFilterCountry = _a.setFilterCountry, exports.setFilterCategory = _a.setFilterCategory, exports.setSearchQuery = _a.setSearchQuery, exports.setCurrentPage = _a.setCurrentPage, exports.setPageSize = _a.setPageSize, exports.resetFilters = _a.resetFilters;
exports.default = filtersSlice.reducer;
//# sourceMappingURL=filtersSlice.js.map