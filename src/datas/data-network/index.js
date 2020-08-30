import reducer from './reducer';

export {
  addInNetworkList,
  clearNetworkList,
  updateNetworkRspData,
  NETWORK_CASE,
  updateNetworkMockerItemData,
} from './action';

export const networkInfo = reducer;
