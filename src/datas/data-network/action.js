export const ADD_IN_NETWORK_LIST = 'ADD_IN_NETWORK_LIST';

export function addInNetworkList(networkRequest) {
  return {
    type: ADD_IN_NETWORK_LIST,
    data: networkRequest,
  };
}
