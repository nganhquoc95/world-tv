import { combineReducers } from '@reduxjs/toolkit';
import { channelsReducer, filtersReducer } from './slices';

export const rootReducer = combineReducers({
  channels: channelsReducer,
  filters: filtersReducer,
});

export type RootState = ReturnType<typeof rootReducer>;