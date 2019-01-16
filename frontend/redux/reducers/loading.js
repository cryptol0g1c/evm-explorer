import {
  IS_FETCHING,
  FETCH_SUCCESS,
  FETCH_FAILURE
} from '../constants';

const initialState = {
  isFetching: false,
  hasFetched: false,
  error: null,
  data: {}
}

export default (state = initialState, action) => {
  switch (action.type) {
    case FETCH_SUCCESS:
      return {
        ...state,
        isFetching: false,
        hasFetched: true,
        data: action.data,
        error: null
      }
    case FETCH_FAILURE:
      return {
        ...state,
        isFetching: false,
        hasFetched: true,
        data: {},
        error: action.error
      }
    case IS_FETCHING:
      return {
        ...state,
        isFetching: true,
        hasFetched: false,
        data: {},
        error: null
      }
    default:
      return state;
  }

}
