import { call, put, delay, race } from 'redux-saga/effects';

// Constants
export const MAX_RETRIES = 3;
export const RETRY_DELAY = 1000; // 1 second
export const REQUEST_TIMEOUT = 30000; // 30 seconds

// Utility function to check if error is network-related
export const isNetworkError = (error: any): boolean => {
  return !error.response || error.code === 'NETWORK_ERROR' || error.message?.includes('fetch');
};

// Utility function to get retry delay with exponential backoff
export const getRetryDelay = (attempt: number): number => {
  return RETRY_DELAY * Math.pow(2, attempt - 1);
};

// Generic request wrapper with retry logic
export function* requestWithRetry<T>(
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