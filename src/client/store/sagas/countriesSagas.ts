import { call, takeLatest, all } from 'redux-saga/effects';
import ApiService from '../../services/ApiService';
import { countriesActions } from '../slices';
import { requestWithRetry } from './sagaUtils';

// Worker sagas
function* fetchCountriesSaga(): Generator<any, void, any> {
  yield* requestWithRetry(
    () => ApiService.fetchCountries(),
    countriesActions.success,
    countriesActions.failure
  );
}

// Watcher sagas
function* watchFetchCountries() {
  yield takeLatest(countriesActions.request, fetchCountriesSaga);
}

export default function* countriesSagas() {
  yield all([
    call(watchFetchCountries),
  ]);
}