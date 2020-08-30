import { MOCKSTAR_DETAIL_REQUEST, MOCKSTAR_DETAIL_REQUEST_FAIL, MOCKSTAR_DETAIL_REQUEST_SUCCESS } from './action';

const initialState = {
  isLoaded: false,
  config: {},
  pkg: {},
  server: 'http://127.0.0.1:9527',
};

export default function mockStarInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case MOCKSTAR_DETAIL_REQUEST:
      update = {
        isLoaded: false,
      };
      break;

    case MOCKSTAR_DETAIL_REQUEST_SUCCESS:
      const { config, pkg } = data.data;

      update = {
        isLoaded: true,
        config,
        pkg,
      };
      break;

    case MOCKSTAR_DETAIL_REQUEST_FAIL:
      update = {
        isLoaded: true,
      };
      break;

    default:
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}
