import { all, call } from 'redux-saga/effects';
import { channelsSagas, filtersSagas } from './sagas/index';

export default function* rootSaga() {
  yield all([
    call(channelsSagas),
    call(filtersSagas),
  ]);
}