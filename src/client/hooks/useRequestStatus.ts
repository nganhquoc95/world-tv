import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { retryChannels, retryCountries, retryCategories } from '../store/actions';

interface RequestStatus {
  loading: boolean;
  error: string | null;
  lastSuccess: number | null;
  lastError: number | null;
}

export const useRequestStatus = () => {
  const dispatch = useDispatch();
  const requests = useSelector((state: RootState) => state.channels.requests);

  const getStatus = (type: 'channels' | 'countries' | 'categories'): RequestStatus => {
    return requests[type];
  };

  const retry = (type: 'channels' | 'countries' | 'categories') => {
    switch (type) {
      case 'channels':
        dispatch(retryChannels());
        break;
      case 'countries':
        dispatch(retryCountries());
        break;
      case 'categories':
        dispatch(retryCategories());
        break;
    }
  };

  const isAnyLoading = () => {
    return Object.values(requests).some(req => req.loading);
  };

  const hasAnyError = () => {
    return Object.values(requests).some(req => req.error !== null);
  };

  const getLastUpdate = (type: 'channels' | 'countries' | 'categories'): number | null => {
    const status = getStatus(type);
    return status.lastSuccess || status.lastError;
  };

  return {
    getStatus,
    retry,
    isAnyLoading: isAnyLoading(),
    hasAnyError: hasAnyError(),
    getLastUpdate,
  };
};