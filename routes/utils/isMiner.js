const config = require('../../config');
const web3 = require('web3');
const _ = require('lodash');

module.exports = address => {
  return !_.isEmpty(config.miners.find(miner =>
    web3.utils.toChecksumAddress(miner.address) == web3.utils.toChecksumAddress(address)
  ));
};
