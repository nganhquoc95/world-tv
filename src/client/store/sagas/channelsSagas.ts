import { call, put, takeLatest, all, delay, race } from 'redux-saga/effects';
import ApiService from '../../services/ApiService';
import {
  fetchChannelsStart,
  fetchChannelsSuccess,
  fetchChannelsFailure,
  fetchCountriesStart,
  fetchCountriesSuccess,
  fetchCountriesFailure,
  fetchCategoriesStart,
  fetchCategoriesSuccess,
  fetchCategoriesFailure,
  retryFetchChannels,
  retryFetchCountries,
  retryFetchCategories,
} from '../slices/channelsSlice';

// Constants
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second
const REQUEST_TIMEOUT = 30000; // 30 seconds

// Utility function to check if error is network-related
const isNetworkError = (error: any): boolean => {
  return !error.response || error.code === 'NETWORK_ERROR' || error.message?.includes('fetch');
};

// Utility function to get retry delay with exponential backoff
const getRetryDelay = (attempt: number): number => {
  return RETRY_DELAY * Math.pow(2, attempt - 1);
};

// Generic request wrapper with retry logic
function* requestWithRetry<T>(
  apiCall: () => Promise<T>,
  successAction: (response: T) => any,
  failureAction: (error: string) => any,
  maxRetries: number = MAX_RETRIES
): Generator<any, T | null, any> {
  let lastError: any = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Race between API call and timeout
      const { response, timeout } = yield race({
        response: call(apiCall),
        timeout: delay(REQUEST_TIMEOUT),
      });

      if (timeout) {
        throw new Error(`Request timeout after ${REQUEST_TIMEOUT}ms`);
      }

      yield put(successAction(response));
      return response;

    } catch (error: any) {
      lastError = error;

      // Don't retry on the last attempt
      if (attempt === maxRetries) {
        break;
      }

      // Don't retry for non-network errors (4xx client errors)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        break;
      }

      // Wait before retrying
      const delayTime = getRetryDelay(attempt);
      yield delay(delayTime);
    }
  }

  // All retries failed
  const errorMessage = lastError?.response?.data?.message ||
                      lastError?.message ||
                      `Request failed after ${maxRetries} attempts`;

  yield put(failureAction(errorMessage));
  return null;
}

// Worker sagas
function* fetchChannelsSaga(): Generator<any, void, any> {
  yield* requestWithRetry(
    () => ApiService.fetchChannels(1, 10000),
    (response: any) => fetchChannelsSuccess(response.data || []),
    fetchChannelsFailure
  );
}

function* fetchCountriesSaga(): Generator<any, void, any> {
  yield* requestWithRetry(
    () => ApiService.fetchCountries(),
    fetchCountriesSuccess,
    fetchCountriesFailure
  );
}

function* fetchCategoriesSaga(): Generator<any, void, any> {
  yield* requestWithRetry(
    () => ApiService.fetchCategories(),
    fetchCategoriesSuccess,
    fetchCategoriesFailure
  );
}

// Retry sagas
function* retryFetchChannelsSaga(): Generator<any, void, any> {
  yield put(fetchChannelsStart());
  yield call(fetchChannelsSaga);
}

function* retryFetchCountriesSaga(): Generator<any, void, any> {
  yield put(fetchCountriesStart());
  yield call(fetchCountriesSaga);
}

function* retryFetchCategoriesSaga(): Generator<any, void, any> {
  yield put(fetchCategoriesStart());
  yield call(fetchCategoriesSaga);
}

// Watcher sagas
function* watchFetchChannels() {
  yield takeLatest(fetchChannelsStart.type, fetchChannelsSaga);
}

function* watchFetchCountries() {
  yield takeLatest(fetchCountriesStart.type, fetchCountriesSaga);
}

function* watchFetchCategories() {
  yield takeLatest(fetchCategoriesStart.type, fetchCategoriesSaga);
}

// Retry watchers
function* watchRetryChannels() {
  yield takeLatest(retryFetchChannels.type, retryFetchChannelsSaga);
}

function* watchRetryCountries() {
  yield takeLatest(retryFetchCountries.type, retryFetchCountriesSaga);
}

function* watchRetryCategories() {
  yield takeLatest(retryFetchCategories.type, retryFetchCategoriesSaga);
}

export default function* channelsSagas() {
  yield all([
    call(watchFetchChannels),
    call(watchFetchCountries),
    call(watchFetchCategories),
    call(watchRetryChannels),
    call(watchRetryCountries),
    call(watchRetryCategories),
  ]);
}