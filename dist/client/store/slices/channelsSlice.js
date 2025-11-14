"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCategoriesFailure = exports.fetchCategoriesSuccess = exports.fetchCategoriesStart = exports.fetchCountriesFailure = exports.fetchCountriesSuccess = exports.fetchCountriesStart = exports.fetchChannelsFailure = exports.fetchChannelsSuccess = exports.fetchChannelsStart = void 0;
const toolkit_1 = require("@reduxjs/toolkit");
const initialState = {
    channels: [],
    countries: [],
    categories: [],
    loading: false,
    error: null,
};
const channelsSlice = (0, toolkit_1.createSlice)({
    name: 'channels',
    initialState,
    reducers: {
        fetchChannelsStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchChannelsSuccess: (state, action) => {
            state.channels = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchChannelsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchCountriesStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCountriesSuccess: (state, action) => {
            state.countries = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchCountriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        fetchCategoriesStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchCategoriesSuccess: (state, action) => {
            state.categories = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchCategoriesFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
    },
});
_a = channelsSlice.actions, exports.fetchChannelsStart = _a.fetchChannelsStart, exports.fetchChannelsSuccess = _a.fetchChannelsSuccess, exports.fetchChannelsFailure = _a.fetchChannelsFailure, exports.fetchCountriesStart = _a.fetchCountriesStart, exports.fetchCountriesSuccess = _a.fetchCountriesSuccess, exports.fetchCountriesFailure = _a.fetchCountriesFailure, exports.fetchCategoriesStart = _a.fetchCategoriesStart, exports.fetchCategoriesSuccess = _a.fetchCategoriesSuccess, exports.fetchCategoriesFailure = _a.fetchCategoriesFailure;
exports.default = channelsSlice.reducer;
//# sourceMappingURL=channelsSlice.js.map