// Action creation utilities for Redux Toolkit
// These utilities help reduce boilerplate when creating Redux actions
import { createAction } from '@reduxjs/toolkit';

/**
 * Generic action creator utility - creates a basic action creator
 * @param type - The action type string
 * @returns Action creator function
 *
 * @example
 * const increment = createActionCreator<number>('counter/increment');
 * dispatch(increment(5));
 */
export const createActionCreator = <T = void>(type: string) => {
  return createAction<T>(type);
};

/**
 * Creates a set of async action creators following the request/success/failure pattern
 * @param baseType - The base action type (e.g., 'users/fetch')
 * @returns Object with request, success, and failure action creators
 *
 * @example
 * const userActions = createAsyncActions<string, User[], string>('users/fetch');
 * dispatch(userActions.request('user123'));
 * dispatch(userActions.success(users));
 * dispatch(userActions.failure('Network error'));
 */
export const createAsyncActions = <TRequest = any, TSuccess = any, TFailure = string>(
  baseType: string
) => {
  return {
    request: createAction<TRequest>(`${baseType}/request`),
    success: createAction<TSuccess>(`${baseType}/success`),
    failure: createAction<TFailure>(`${baseType}/failure`),
  };
};

/**
 * Creates an action creator with optional payload validation
 * @param type - The action type string
 * @param validator - Optional validation function for the payload
 * @returns Action creator with validated method
 *
 * @example
 * const setAge = createValidatedAction<number>('user/setAge', (age) => age >= 0 && age <= 150);
 * dispatch(setAge.validated(25)); // Works
 * dispatch(setAge.validated(-5)); // Throws error
 */
export const createValidatedAction = <T>(
  type: string,
  validator?: (payload: T) => boolean
) => {
  const action = createAction<T>(type);
  return Object.assign(action, {
    validated: (payload: T) => {
      if (validator && !validator(payload)) {
        throw new Error(`Invalid payload for action ${type}`);
      }
      return action(payload);
    }
  });
};

/**
 * Creates an action creator that supports metadata
 * @param type - The action type string
 * @returns Action creator that accepts payload and meta
 *
 * @example
 * const logAction = createActionWithMeta<string, { timestamp: number }>('app/log');
 * dispatch(logAction('User logged in', { timestamp: Date.now() }));
 */
export const createActionWithMeta = <TPayload = void, TMeta = any>(
  type: string
) => {
  const actionCreator = (payload: TPayload, meta: TMeta) => ({
    type,
    payload,
    meta,
  });
  actionCreator.type = type;
  actionCreator.toString = () => type;
  return actionCreator;
};

/**
 * Creates a retry action creator for a given base type
 * @param baseType - The base action type
 * @returns Retry action creator
 *
 * @example
 * const retryFetchUser = createRetryAction('users/fetch');
 * dispatch(retryFetchUser());
 */
export const createRetryAction = (baseType: string) => {
  return createAction(`${baseType}/retry`);
};

/**
 * Creates a clear error action creator for a given base type
 * @param baseType - The base action type
 * @returns Clear error action creator
 *
 * @example
 * const clearUserError = createClearErrorAction('users');
 * dispatch(clearUserError());
 */
export const createClearErrorAction = (baseType: string) => {
  return createAction(`${baseType}/clearError`);
};

/**
 * Creates a batch of related action creators for multiple types
 * @param baseTypes - Array of base action types
 * @returns Object with all action creators
 *
 * @example
 * const actions = createBatchActions(['users', 'posts']);
 * // Creates: users, usersSuccess, usersFailure, usersRetry, usersClearError, etc.
 * dispatch(actions.users());
 */
export const createBatchActions = (baseTypes: string[]) => {
  return baseTypes.reduce((acc, type) => {
    acc[type] = createAction(`${type}/request`);
    acc[`${type}Success`] = createAction(`${type}/success`);
    acc[`${type}Failure`] = createAction<string>(`${type}/failure`);
    acc[`${type}Retry`] = createAction(`${type}/retry`);
    acc[`${type}ClearError`] = createAction(`${type}/clearError`);
    return acc;
  }, {} as Record<string, any>);
};