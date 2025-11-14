import { call, takeLatest, all } from 'redux-saga/effects';
import ApiService from '../../services/ApiService';
import { categoriesActions } from '../slices';
import { requestWithRetry } from './sagaUtils';

// Worker sagas
function* fetchCategoriesSaga(): Generator<any, void, any> {
  yield* requestWithRetry(
    () => ApiService.fetchCategories(),
    categoriesActions.success,
    categoriesActions.failure
  );
}

// Watcher sagas
function* watchFetchCategories() {
  yield takeLatest(categoriesActions.request, fetchCategoriesSaga);
}

export default function* categoriesSagas() {
  yield all([
    call(watchFetchCategories),
  ]);
}