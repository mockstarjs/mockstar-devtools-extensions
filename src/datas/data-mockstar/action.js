import axios from 'axios';

export const MOCKSTAR_DETAIL_REQUEST = 'MOCKSTAR_DETAIL_REQUEST';
export const MOCKSTAR_DETAIL_REQUEST_SUCCESS = 'MOCKSTAR_DETAIL_REQUEST_SUCCESS';
export const MOCKSTAR_DETAIL_REQUEST_FAIL = 'MOCKSTAR_DETAIL_REQUEST_FAIL';
export const MOCKSTAR_INIT_ENABLE_WATCH = 'MOCKSTAR_INIT_ENABLE_WATCH';
export const MOCKSTAR_UPDATE_ENABLE_WATCH = 'MOCKSTAR_UPDATE_ENABLE_WATCH';
export const MOCKSTAR_UPDATE_SERVER = 'MOCKSTAR_UPDATE_SERVER';
export const MOCKSTAR_UPDATE_IS_STARTED = 'MOCKSTAR_UPDATE_IS_STARTED';

export function loadMockStarDetail() {
  return (dispatch, getState) => {
    dispatch({
      type: MOCKSTAR_DETAIL_REQUEST,
    });

    return new Promise((resolve, reject) => {
      const { mockStarInfo } = getState();

      // 如果没有开启监听，则不再请求
      if (!mockStarInfo.enableWatch) {
        return;
      }

      axios.get(`${mockStarInfo.server}/mockstar-cgi/detail`)
        .then((res) => {
          console.log('fetchMockStarDetail then', res);

          dispatch({
            type: MOCKSTAR_DETAIL_REQUEST_SUCCESS,
            data: res,
          });

          resolve(res);
        })
        .catch((err) => {
          console.log('fetchMockStarDetail catch', err);

          dispatch({
            type: MOCKSTAR_DETAIL_REQUEST_FAIL,
            data: err,
          });

          resolve(err);
        });
    });
  };
}

export function updateEnableWatch(enableWatch) {
  return (dispatch) => {
    return new Promise((resolve) => {
      localStorage.setItem('mockstar_enable_watch', enableWatch ? '1' : '0');

      dispatch({
        type: MOCKSTAR_UPDATE_ENABLE_WATCH,
        data: enableWatch,
      });

      resolve(enableWatch);
    });
  };

}

export function updateMockStarServer(server) {
  return {
    type: MOCKSTAR_UPDATE_SERVER,
    data: server,
  };
}

export function initEnableWatch() {
  return (dispatch) => {
    return new Promise((resolve) => {
      const enableWatch = localStorage.getItem('mockstar_enable_watch') !== '0';

      dispatch({
        type: MOCKSTAR_INIT_ENABLE_WATCH,
        data: enableWatch,
      });

      resolve(enableWatch);
    });
  };
}

export function updateIsStarted(isStarted) {
  return {
    type: MOCKSTAR_UPDATE_IS_STARTED,
    data: isStarted,
  };
}
