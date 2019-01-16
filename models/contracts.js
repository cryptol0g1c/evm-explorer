const mongoose = require('mongoose');

const contractSchema = mongoose.Schema({
  msg: String,
  type: String,
  abi: [],
  block: String,
  gas: Number,
  events: [{
    name: String,
    params: [String]
  }],
  bytecode: String,
  address: String,
  timestamp: String,
  encodedAbi: String,
  txHash: String,
  interactions: [{
    txHash: String,
    timestamp: String
  }],
  value: Number,
  from: String,
  input: String,
  source: {
    code: String,
    compilerVersion: String,
    contractName: String,
    optimizerEnabled: Boolean,
    contractDecodedParameters: String,
    verified: {
      type: Boolean,
      default: false
    }
  }
});

module.exports = mongoose.model('Contract', contractSchema);
