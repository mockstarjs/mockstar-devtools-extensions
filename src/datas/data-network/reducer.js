import { ADD_IN_NETWORK_LIST } from './action';

import { data1 } from './mock';

const initialState = {
  list: [data1],
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

