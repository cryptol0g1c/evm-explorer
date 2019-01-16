import {
  isFetching,
  fetchSuccess,
  fetchFailure
} from '../redux/actions/loading';

export let get = (route, dispatch) => {
  if (dispatch) {
    dispatch(isFetching());
  }

  return fetch(route)
    .then(response => response.json())
    .then(({ success, data, error }) => {
      if (success) {
        if (dispatch) {
          dispatch(fetchSuccess(data));
        } else {
          return data;
        }
      } else {
        if (dispatch) {
          dispatch(fetchFailure(error));
        } else {
          return error;
        }
      }
    })
    .catch(error => {
      dispatch(fetchFailure(error));
    });
}

export let post = (route, body, dispatch) => {
  if (dispatch) {
    dispatch(isFetching());
  }

  return fetch(route, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(response => response.json())
    .catch(error => {
      if (dispatch) {
        dispatch(fetchFailure(error));
      }
    });
}
