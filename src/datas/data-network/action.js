import axios from 'axios';
import urlParse from 'url-parse';

export const ADD_IN_NETWORK_LIST = 'ADD_IN_NETWORK_LIST';
export const UPDATE_NETWORK_RSP_DATA = 'UPDATE_NETWORK_RSP_DATA';
export const CLEAR_NETWORK_LIST = 'CLEAR_NETWORK_LIST';

export function addInNetworkList(networkRequest) {
  return (dispatch, getState) => {
    return new Promise((resolve, reject) => {
      const { mockStarInfo } = getState();

      const urlParseResult = urlParse(networkRequest.request.url);
      const searchOpts = {
        route: urlParseResult.pathname,
      };

      // 搜索 route 是否存在本地匹配的
      axios.post(`${mockStarInfo.server}/mockstar-cgi/search-mocker-list`, searchOpts)
        .then((res) => {
          console.log('search-mocker-list then', res);

          if (res.data && res.data.retcode === 0) {
            networkRequest.mockerItem = res.data.result.mockerItem;
          }

          dispatch({
            type: ADD_IN_NETWORK_LIST,
            data: networkRequest,
          });
        })
        .catch((err) => {
          console.log('search-mocker-list catch', err);

          dispatch({
            type: ADD_IN_NETWORK_LIST,
            data: networkRequest,
          });
        });
    });
  };
}

export function updateNetworkRspData(id, data) {
  let jsonData;

  try {
    jsonData = JSON.parse(data);
  } catch (e) {
    jsonData = {};
    console.log('updateNetworkRspData JSON.parse catch err', data);
  }

  return {
    type: UPDATE_NETWORK_RSP_DATA,
    data: {
      id,
      jsonData,
    },
  };
}

export function clearNetworkList() {
  return {
    type: CLEAR_NETWORK_LIST,
  };
}
