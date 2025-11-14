import { all, call } from 'redux-saga/effects';
import { channelsSagas, countriesSagas, categoriesSagas, filtersSagas } from './sagas/index';

export default function* rootSaga() {
  yield all([
    call(channelsSagas),
    call(countriesSagas),
    call(categoriesSagas),
    call(filtersSagas),
  ]);
}