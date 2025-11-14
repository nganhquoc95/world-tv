"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = channelsSagas;
const effects_1 = require("redux-saga/effects");
const ApiService_1 = __importDefault(require("../../services/ApiService"));
const channelsSlice_1 = require("../slices/channelsSlice");
// Worker sagas
function* fetchChannelsSaga() {
    try {
        yield (0, effects_1.put)((0, channelsSlice_1.fetchChannelsStart)());
        const response = yield (0, effects_1.call)(ApiService_1.default.fetchChannels, 1, 10000);
        yield (0, effects_1.put)((0, channelsSlice_1.fetchChannelsSuccess)(response.data || []));
    }
    catch (error) {
        yield (0, effects_1.put)((0, channelsSlice_1.fetchChannelsFailure)(error instanceof Error ? error.message : 'Failed to fetch channels'));
    }
}
function* fetchCountriesSaga() {
    try {
        yield (0, effects_1.put)((0, channelsSlice_1.fetchCountriesStart)());
        const countries = yield (0, effects_1.call)(ApiService_1.default.fetchCountries);
        yield (0, effects_1.put)((0, channelsSlice_1.fetchCountriesSuccess)(countries));
    }
    catch (error) {
        yield (0, effects_1.put)((0, channelsSlice_1.fetchCountriesFailure)(error instanceof Error ? error.message : 'Failed to fetch countries'));
    }
}
function* fetchCategoriesSaga() {
    try {
        yield (0, effects_1.put)((0, channelsSlice_1.fetchCategoriesStart)());
        const categories = yield (0, effects_1.call)(ApiService_1.default.fetchCategories);
        yield (0, effects_1.put)((0, channelsSlice_1.fetchCategoriesSuccess)(categories));
    }
    catch (error) {
        yield (0, effects_1.put)((0, channelsSlice_1.fetchCategoriesFailure)(error instanceof Error ? error.message : 'Failed to fetch categories'));
    }
}
// Watcher sagas
function* watchFetchChannels() {
    yield (0, effects_1.takeLatest)('channels/fetchChannelsStart', fetchChannelsSaga);
}
function* watchFetchCountries() {
    yield (0, effects_1.takeLatest)('channels/fetchCountriesStart', fetchCountriesSaga);
}
function* watchFetchCategories() {
    yield (0, effects_1.takeLatest)('channels/fetchCategoriesStart', fetchCategoriesSaga);
}
function* channelsSagas() {
    yield (0, effects_1.all)([
        watchFetchChannels(),
        watchFetchCountries(),
        watchFetchCategories(),
    ]);
}
//# sourceMappingURL=channelsSagas.js.map