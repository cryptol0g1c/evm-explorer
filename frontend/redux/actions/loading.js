import {
    IS_FETCHING,
    FETCH_SUCCESS,
    FETCH_FAILURE
  } from '../constants';

export const isFetching = () => ({
    type: IS_FETCHING
});

export const fetchSuccess = data => ({
    type: FETCH_SUCCESS,
    data
});

export const fetchFailure = error => ({
    type: FETCH_FAILURE,
    error
});
