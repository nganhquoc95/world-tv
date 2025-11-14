import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { channelsActions, countriesActions, categoriesActions } from '../store/slices';

export const useRequestStatus = () => {
  const dispatch = useDispatch();
  const { loading: channelsLoading, error: channelsError } = useSelector((state: RootState) => state.channels);
  const { loading: countriesLoading, error: countriesError } = useSelector((state: RootState) => state.countries);
  const { loading: categoriesLoading, error: categoriesError } = useSelector((state: RootState) => state.categories);

  const getStatus = (type: 'channels' | 'countries' | 'categories') => {
    switch (type) {
      case 'channels':
        return { loading: channelsLoading, error: channelsError };
      case 'countries':
        return { loading: countriesLoading, error: countriesError };
      case 'categories':
        return { loading: categoriesLoading, error: categoriesError };
      default:
        throw new Error(`Unknown request type: ${type}`);
    }
  };

  const retry = (type: 'channels' | 'countries' | 'categories') => {
    switch (type) {
      case 'channels':
        dispatch(channelsActions.request());
        break;
      case 'countries':
        dispatch(countriesActions.request());
        break;
      case 'categories':
        dispatch(categoriesActions.request());
        break;
    }
  };

  const isAnyLoading = () => {
    return channelsLoading || countriesLoading || categoriesLoading;
  };

  const hasAnyError = () => {
    return channelsError !== null || countriesError !== null || categoriesError !== null;
  };

  const getLastUpdate = (_type: 'channels' | 'countries' | 'categories'): number | null => {
    // Since we simplified the state structure, we don't have lastSuccess/lastError timestamps
    // This could be added back if needed in the future
    return null;
  };

  return {
    getStatus,
    retry,
    isAnyLoading: isAnyLoading(),
    hasAnyError: hasAnyError(),
    getLastUpdate,
  };
};