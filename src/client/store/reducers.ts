import { combineReducers } from '@reduxjs/toolkit';
import { channelsReducer, countriesReducer, categoriesReducer, filtersReducer } from './slices';

const rootReducer = combineReducers({
  channels: channelsReducer,
  countries: countriesReducer,
  categories: categoriesReducer,
  filters: filtersReducer,
});

export { rootReducer };
export type RootState = ReturnType<typeof rootReducer>;