import { ADD_IN_NETWORK_LIST } from './action';

import { dataGet, dataPost } from './mock';

const initialState = {
  list: [dataGet, dataPost],
};

export default function networkInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case ADD_IN_NETWORK_LIST:
      update = {
        list: [...state.list, data],
      };
      break;
    default:
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}

