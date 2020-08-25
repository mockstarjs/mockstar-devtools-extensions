import { ADD_IN_NETWORK_LIST, UPDATE_NETWORK_RSP_DATA } from './action';

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

      update = {
        list: [...state.list, data],
      };
      break;
    case UPDATE_NETWORK_RSP_DATA:
      update = {
        list: getNewList(state.list, data.id, data.jsonData),
      };
      break;
    default:
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

function getNewList(list, id, data) {
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
