import axios from 'axios';
import urlParse from 'url-parse';

export const ADD_IN_NETWORK_LIST = 'ADD_IN_NETWORK_LIST';
export const UPDATE_NETWORK_RSP_DATA = 'UPDATE_NETWORK_RSP_DATA';
export const UPDATE_NETWORK_MOCKER_ITEM_DATA = 'UPDATE_NETWORK_MOCKER_ITEM_DATA';
export const CLEAR_NETWORK_LIST = 'CLEAR_NETWORK_LIST';

export const NETWORK_CASE = {
  // 既没有匹配路由，也不是 mock 数据
  NOT_MATCHED_NOT_MOCK: 'NOT_MATCHED_NOT_MOCK',

  // 匹配了路由，但不是 mock 数据
  MATCHED_NOT_MOCK: 'MATCHED_NOT_MOCK',

  // 没有匹配路由，但是 mock 数据
  NOT_MATCHED_BUT_MOCK: 'NOT_MATCHED_BUT_MOCK',

  // 既匹配了路由，也是 mock 数据
  MATCHED_AND_MOCK: 'MATCHED_AND_MOCK',
};

export function addInNetworkList(networkRequest) {
  return (dispatch) => {
    // 加入到列表中
    dispatch({
      type: ADD_IN_NETWORK_LIST,
      data: networkRequest,
    });

    // 更新是否匹配本地 MockStar
    dispatch(updateNetworkMockerItemData(networkRequest));
  };
}

export function updateNetworkMockerItemData(networkRequest) {
  return (dispatch, getState) => {
    // 若开启了监听本地 MockStar 服务，且服务启动成功，则需要额外进行匹配处理
    const { mockStarInfo } = getState();
    if (!mockStarInfo.isStarted) {
      return;
    }

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
