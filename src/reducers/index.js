import { combineReducers } from 'redux';

import { networkInfo } from '../datas/data-network';
import { mockStarInfo } from '../datas/data-mockstar';

const rootReducer = combineReducers({
  networkInfo,
  mockStarInfo
});

export default rootReducer;
