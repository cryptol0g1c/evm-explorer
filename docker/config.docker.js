const Web3 = require('web3');

const hostURL = process.env.RPC_PROVIDER;
const wsURL = process.env.WS_PROVIDER;
const explorerUrl = process.env.EXPLORER_URL;

module.exports = {
  explorerUrl,
  hostURL,
  wsURL,
  provider: new Web3.providers.HttpProvider(hostURL),
  wsProvider: new Web3.providers.WebsocketProvider(wsURL),
  mongoUri: process.env.MONGO_URI,
  miners: [{
    address: '0xe33e78004f72e45a97b778b63219b1cbafab9986',
    name: ''
  }, {
    address: '0x0a0f29a9b479d91f6d112b203c7d9db0cb4cdb84',
    name: ''
  }]
};
