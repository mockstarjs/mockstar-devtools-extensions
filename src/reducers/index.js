import { combineReducers } from 'redux';

import { networkInfo } from '../datas/data-network';

const rootReducer = combineReducers({
  networkInfo,
});

export default rootReducer;
