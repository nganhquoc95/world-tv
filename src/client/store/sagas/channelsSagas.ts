import { call, put, takeLatest, all } from 'redux-saga/effects';
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
} from '../slices/channelsSlice';

// Worker sagas
function* fetchChannelsSaga(): Generator<any, void, any> {
  try {
    yield put(fetchChannelsStart());
    const response = yield call(ApiService.fetchChannels, 1, 10000);
    yield put(fetchChannelsSuccess(response.data || []));
  } catch (error) {
    yield put(fetchChannelsFailure(error instanceof Error ? error.message : 'Failed to fetch channels'));
  }
}

function* fetchCountriesSaga(): Generator<any, void, any> {
  try {
    yield put(fetchCountriesStart());
    const countries = yield call(ApiService.fetchCountries);
    yield put(fetchCountriesSuccess(countries));
  } catch (error) {
    yield put(fetchCountriesFailure(error instanceof Error ? error.message : 'Failed to fetch countries'));
  }
}

function* fetchCategoriesSaga(): Generator<any, void, any> {
  try {
    yield put(fetchCategoriesStart());
    const categories = yield call(ApiService.fetchCategories);
    yield put(fetchCategoriesSuccess(categories));
  } catch (error) {
    yield put(fetchCategoriesFailure(error instanceof Error ? error.message : 'Failed to fetch categories'));
  }
}

// Watcher sagas
function* watchFetchChannels() {
  yield takeLatest('channels/fetchChannelsStart', fetchChannelsSaga);
}

function* watchFetchCountries() {
  yield takeLatest('channels/fetchCountriesStart', fetchCountriesSaga);
}

function* watchFetchCategories() {
  yield takeLatest('channels/fetchCategoriesStart', fetchCategoriesSaga);
}

export default function* channelsSagas() {
  yield all([
    watchFetchChannels(),
    watchFetchCountries(),
    watchFetchCategories(),
  ]);
}