// Action creators for triggering sagas using createAsyncActions utility
import { createAsyncActions, createRetryAction, createClearErrorAction } from './actionUtils';

// Create async action sets for different data types
export const channelsActions = createAsyncActions<void, any[], string>('channels/fetch');
export const countriesActions = createAsyncActions<void, any[], string>('countries/fetch');
export const categoriesActions = createAsyncActions<void, any[], string>('categories/fetch');

// Legacy aliases for backward compatibility
export const fetchChannels = channelsActions.request;
export const fetchCountries = countriesActions.request;
export const fetchCategories = categoriesActions.request;

// Retry actions using utility
export const retryChannels = createRetryAction('channels/fetch');
export const retryCountries = createRetryAction('countries/fetch');
export const retryCategories = createRetryAction('categories/fetch');

// Clear error actions using utility
export const clearChannelsError = createClearErrorAction('channels');
export const clearCountriesError = createClearErrorAction('countries');
export const clearCategoriesError = createClearErrorAction('categories');