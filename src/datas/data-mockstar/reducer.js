import {
  MOCKSTAR_DETAIL_REQUEST,
  MOCKSTAR_DETAIL_REQUEST_FAIL,
  MOCKSTAR_DETAIL_REQUEST_SUCCESS,
  MOCKSTAR_INIT_ENABLE_WATCH,
  MOCKSTAR_UPDATE_ENABLE_WATCH,
  MOCKSTAR_UPDATE_SERVER,
} from './action';

const initialState = {
  isLoaded: false,
  config: {},
  pkg: {},
  server: 'http://127.0.0.1:9527',
  isStarted: false,
  enableWatch: true,
};

export default function mockStarInfo(state = initialState, action) {
  let { type, data } = action,
    update = {};

  switch (type) {
    case MOCKSTAR_DETAIL_REQUEST:
      update = {
        isLoaded: false,
        isStarted: false,
      };
      break;

    case MOCKSTAR_DETAIL_REQUEST_SUCCESS:
      const { config, pkg } = data.data;

      update = {
        isLoaded: true,
        isStarted: true,
        config,
        pkg,
      };
      break;

    case MOCKSTAR_DETAIL_REQUEST_FAIL:
      update = {
        isLoaded: true,
        isStarted: false,
      };
      break;

    case MOCKSTAR_INIT_ENABLE_WATCH:
      update = {
        enableWatch: data,
      };
      break;

    case MOCKSTAR_UPDATE_ENABLE_WATCH:
      update = {
        enableWatch: data,
      };
      break;

    case MOCKSTAR_UPDATE_SERVER:
      update = {
        server: data,
      };
      break;

    default:
      break;
  }

  return Object.keys(update).length ? Object.assign({}, state, update) : state;
}
