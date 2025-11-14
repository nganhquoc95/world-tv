import { call, takeLatest, all } from 'redux-saga/effects';
import ApiService from '../../services/ApiService';
import { channelsActions } from '../slices';
import { requestWithRetry } from './sagaUtils';

// Worker sagas
function* fetchChannelsSaga(): Generator<any, void, any> {
  yield* requestWithRetry(
    () => ApiService.fetchChannels(1, 10000),
    (response: any) => channelsActions.success(response.data || []),
    channelsActions.failure
  );
}

// Watcher sagas
function* watchFetchChannels() {
  yield takeLatest(channelsActions.request, fetchChannelsSaga);
}

export default function* channelsSagas() {
  yield all([
    call(watchFetchChannels),
  ]);
}