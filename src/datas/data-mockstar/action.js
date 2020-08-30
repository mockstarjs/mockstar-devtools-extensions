import axios from 'axios';

export const MOCKSTAR_DETAIL_REQUEST = 'MOCKSTAR_DETAIL_REQUEST';
export const MOCKSTAR_DETAIL_REQUEST_SUCCESS = 'MOCKSTAR_DETAIL_REQUEST_SUCCESS';
export const MOCKSTAR_DETAIL_REQUEST_FAIL = 'MOCKSTAR_DETAIL_REQUEST_FAIL';
export const MOCKSTAR_UPDATE_ENABLE_WATCH = 'MOCKSTAR_UPDATE_ENABLE_WATCH';
export const MOCKSTAR_UPDATE_SERVER = 'MOCKSTAR_UPDATE_SERVER';

export function loadMockStarDetail() {
  return (dispatch, getState) => {
    dispatch({
      type: MOCKSTAR_DETAIL_REQUEST,
    });

    return new Promise((resolve, reject) => {
      const { mockStarInfo } = getState();

      axios.get(`${mockStarInfo.server}/mockstar-cgi/detail`)
        .then((res) => {
          console.log('fetchMockStarDetail then', res);

          dispatch({
            type: MOCKSTAR_DETAIL_REQUEST_SUCCESS,
            data: res,
          });
        })
        .catch((err) => {
          console.log('fetchMockStarDetail catch', err);

          dispatch({
            type: MOCKSTAR_DETAIL_REQUEST_FAIL,
            data: err,
          });
        });
    });
  };
}

export function updateEnableWatch(enableWatch) {
  return {
    type: MOCKSTAR_UPDATE_ENABLE_WATCH,
    data: enableWatch,
  };
}

export function updateMockStarServer(server) {
  return {
    type: MOCKSTAR_UPDATE_SERVER,
    data: server,
  };
}
