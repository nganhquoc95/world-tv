import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IChannelItem, ICountry } from '../../types';

const initialState = {
  channels: [] as IChannelItem[],
  countries: [] as ICountry[],
  categories: [] as string[],
  loading: false,
  error: null as string | null,
};

const channelsSlice = createSlice({
  name: 'channels',
  initialState,
  reducers: {
    fetchChannelsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchChannelsSuccess: (state, action: PayloadAction<IChannelItem[]>) => {
      state.channels = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchChannelsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCountriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCountriesSuccess: (state, action: PayloadAction<ICountry[]>) => {
      state.countries = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCountriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchCategoriesStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchCategoriesSuccess: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
      state.loading = false;
      state.error = null;
    },
    fetchCategoriesFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
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
} = channelsSlice.actions;

export default channelsSlice.reducer;