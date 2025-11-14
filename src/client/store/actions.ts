// Action creators for triggering sagas
import {
  fetchChannelsStart,
  fetchCountriesStart,
  fetchCategoriesStart,
  retryFetchChannels,
  retryFetchCountries,
  retryFetchCategories
} from './slices/channelsSlice';

export const fetchChannels = fetchChannelsStart;
export const fetchCountries = fetchCountriesStart;
export const fetchCategories = fetchCategoriesStart;

// Retry actions
export const retryChannels = retryFetchChannels;
export const retryCountries = retryFetchCountries;
export const retryCategories = retryFetchCategories;