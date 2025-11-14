"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchCategories = exports.fetchCountries = exports.fetchChannels = void 0;
// Action creators for triggering sagas
const fetchChannels = () => ({
    type: 'channels/fetchChannelsStart',
});
exports.fetchChannels = fetchChannels;
const fetchCountries = () => ({
    type: 'channels/fetchCountriesStart',
});
exports.fetchCountries = fetchCountries;
const fetchCategories = () => ({
    type: 'channels/fetchCategoriesStart',
});
exports.fetchCategories = fetchCategories;
//# sourceMappingURL=actions.js.map