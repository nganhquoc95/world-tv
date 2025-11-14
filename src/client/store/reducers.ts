import { combineReducers } from '@reduxjs/toolkit';
import channelsReducer from './slices/channelsSlice';
import filtersReducer from './slices/filtersSlice';

export const rootReducer = combineReducers({
  channels: channelsReducer,
  filters: filtersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;