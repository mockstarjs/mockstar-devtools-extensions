import {
  ADD_IN_NETWORK_LIST,
  CLEAR_NETWORK_LIST,
  NETWORK_CASE,
  UPDATE_NETWORK_MOCKER_ITEM_DATA,
  UPDATE_NETWORK_RSP_DATA,
} from './action';

const initialState = {
  list: [],
};

export default function networkInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case ADD_IN_NETWORK_LIST:
      // 如果存在 response.body 则将其转义为 json 格式
      if (!data.response.jsonData && data.response.body) {
        try {
          data.response.jsonData = JSON.parse(data.response.body);
        } catch (e) {
        }
      } else {
        data.response.jsonData = Object.assign({}, data.response.jsonData);
      }

      // 当前是否已经是 mocker 数据
      const responseHeaders = data.response.headers;
      const mockstarMockerItem = responseHeaders && responseHeaders.filter(item => item.name === 'x-mockstar-mocker')[0];
      const mockstarMockModuleItem = responseHeaders && responseHeaders.filter(item => item.name === 'x-mockstar-mock-module')[0];
      if (mockstarMockerItem && mockstarMockModuleItem) {
        data.mockstar = {
          mocker: mockstarMockerItem.value,
          mockModule: mockstarMockModuleItem.value,
        };
      }

      // 当前请求的场景类型
      data.networkCase = getNetworkCase(data.mockerItem, data.mockstar);

      update = {
        list: [...state.list, data],
      };
      break;

    case UPDATE_NETWORK_RSP_DATA:
      update = {
        list: getNewListWithRspData(state.list, data.id, data.jsonData),
      };
      break;

    case UPDATE_NETWORK_MOCKER_ITEM_DATA:
      update = {
        list: getNewListWithMockerItemData(state.list, data.id, data.mockerItem),
      };
      break;

    case CLEAR_NETWORK_LIST:
      update = {
        list: [],
      };
      break;
    default:
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

function getNewListWithRspData(list, id, data) {
  const newList = [...list];
  for (let i = 0; i < newList.length; i++) {
    const item = newList[i];
    if (item.id === id) {
      item.response.jsonData = data;
      break;
    }
  }

  return newList;
}

function getNewListWithMockerItemData(list, id, data) {
  const newList = [...list];

  for (let i = 0; i < newList.length; i++) {
    const item = newList[i];
    if (item.id === id) {
      item.mockerItem = data;

      // 更新当前请求的场景类型
      item.networkCase = getNetworkCase(item.mockerItem, item.mockstar);
      break;
    }
  }

  return newList;
}

function getNetworkCase(mockerItem, mockstar) {
  if (mockerItem) {
    return mockstar ? NETWORK_CASE.MATCHED_AND_MOCK : NETWORK_CASE.MATCHED_NOT_MOCK;
  } else {
    return mockstar ? NETWORK_CASE.NOT_MATCHED_BUT_MOCK : NETWORK_CASE.NOT_MATCHED_NOT_MOCK;
  }
}
