import axios from 'axios';
import urlParse from 'url-parse';

export const ADD_IN_NETWORK_LIST = 'ADD_IN_NETWORK_LIST';
export const UPDATE_NETWORK_RSP_DATA = 'UPDATE_NETWORK_RSP_DATA';
export const UPDATE_NETWORK_MOCKER_ITEM_DATA = 'UPDATE_NETWORK_MOCKER_ITEM_DATA';
export const CLEAR_NETWORK_LIST = 'CLEAR_NETWORK_LIST';

export function addInNetworkList(networkRequest) {
  return (dispatch, getState) => {
    // 加入到列表中
    dispatch({
      type: ADD_IN_NETWORK_LIST,
      data: networkRequest,
    });

    // 若开启了监听本地 MockStar 服务，则需要额外进行匹配处理
    const { mockStarInfo } = getState();
    if (mockStarInfo.enableWatch) {
      // 获取当前 url 对于的 route
      const urlParseResult = urlParse(networkRequest.request.url);

      // 搜索 route 是否存在本地匹配的，若匹配则更新
      axios.post(`${mockStarInfo.server}/mockstar-cgi/search-mocker-list`, {
        route: urlParseResult.pathname,
      })
        .then((res) => {
          console.log('search-mocker-list then', res);

          // 查询成功之后进行更新
          if (res.data && res.data.retcode === 0) {
            dispatch({
              type: UPDATE_NETWORK_MOCKER_ITEM_DATA,
              data: {
                id: networkRequest.id,
                mockerItem: res.data.result.mockerItem,
              },
            });
          }
        })
        .catch((err) => {
          console.log('search-mocker-list catch', err);

          dispatch({
            type: ADD_IN_NETWORK_LIST,
            data: networkRequest,
          });
        });
    }
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
