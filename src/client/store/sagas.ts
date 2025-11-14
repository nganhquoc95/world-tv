import { all, call } from 'redux-saga/effects';
import channelsSagas from './sagas/channelsSagas';

export default function* rootSaga() {
  yield all([
    call(channelsSagas),
  ]);
}