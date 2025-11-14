import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChannelItem, ICountry } from '../../types';

interface RequestState {
  loading: boolean;
  error: string | null;
  lastSuccess: number | null;
  lastError: number | null;
}

const initialState = {
  channels: [] as IChannelItem[],
  countries: [] as ICountry[],
  categories: [] as string[],
  requests: {
    channels: { loading: false, error: null, lastSuccess: null, lastError: null } as RequestState,
    countries: { loading: false, error: null, lastSuccess: null, lastError: null } as RequestState,
    categories: { loading: false, error: null, lastSuccess: null, lastError: null } as RequestState,
  },
  // Keep legacy loading/error for backward compatibility
  loading: false,
  error: null as string | null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    // Channels
    fetchChannelsStart: (state) => {
      state.requests.channels.loading = true;
      state.requests.channels.error = null;
      // Legacy support
      state.loading = true;
      state.error = null;
    },
    fetchChannelsSuccess: (state, action: PayloadAction<IChannelItem[]>) => {
      state.channels = action.payload;
      state.requests.channels.loading = false;
      state.requests.channels.error = null;
      state.requests.channels.lastSuccess = Date.now();
      // Legacy support
      state.loading = false;
      state.error = null;
    },
    fetchChannelsFailure: (state, action: PayloadAction<string>) => {
      state.requests.channels.loading = false;
      state.requests.channels.error = action.payload;
      state.requests.channels.lastError = Date.now();
      // Legacy support
      state.loading = false;
      state.error = action.payload;
    },
    // Countries
    fetchCountriesStart: (state) => {
      state.requests.countries.loading = true;
      state.requests.countries.error = null;
      // Legacy support
      state.loading = true;
      state.error = null;
    },
    fetchCountriesSuccess: (state, action: PayloadAction<ICountry[]>) => {
      state.countries = action.payload;
      state.requests.countries.loading = false;
      state.requests.countries.error = null;
      state.requests.countries.lastSuccess = Date.now();
      // Legacy support
      state.loading = false;
      state.error = null;
    },
    fetchCountriesFailure: (state, action: PayloadAction<string>) => {
      state.requests.countries.loading = false;
      state.requests.countries.error = action.payload;
      state.requests.countries.lastError = Date.now();
      // Legacy support
      state.loading = false;
      state.error = action.payload;
    },
    // Categories
    fetchCategoriesStart: (state) => {
      state.requests.categories.loading = true;
      state.requests.categories.error = null;
      // Legacy support
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
      state.requests.categories.loading = false;
      state.requests.categories.error = null;
      state.requests.categories.lastSuccess = Date.now();
      // Legacy support
      state.loading = false;
      state.error = null;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.requests.categories.loading = false;
      state.requests.categories.error = action.payload;
      state.requests.categories.lastError = Date.now();
      // Legacy support
      state.loading = false;
      state.error = action.payload;
    },
    // Clear errors
    clearChannelsError: (state) => {
      state.requests.channels.error = null;
    },
    clearCountriesError: (state) => {
      state.requests.countries.error = null;
    },
    clearCategoriesError: (state) => {
      state.requests.categories.error = null;
    },
    // Retry actions
    retryFetchChannels: (state) => {
      state.requests.channels.error = null;
    },
    retryFetchCountries: (state) => {
      state.requests.countries.error = null;
    },
    retryFetchCategories: (state) => {
      state.requests.categories.error = null;
    },
  },
});

export const {
  fetchChannelsStart,
  fetchChannelsSuccess,
  fetchChannelsFailure,
  fetchCountriesStart,
  fetchCountriesSuccess,
  fetchCountriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  clearChannelsError,
  clearCountriesError,
  clearCategoriesError,
  retryFetchChannels,
  retryFetchCountries,
  retryFetchCategories,
} = channelsSlice.actions;

export default channelsSlice.reducer;