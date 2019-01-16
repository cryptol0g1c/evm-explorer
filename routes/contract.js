const bytecodeUtils = require('bytecode-utils');
const config = require('../config');
const Contracts = require('../models/contracts');
const express = require('express');
const parityApi = require('@parity/api');
const router = express.Router();
const Web3 = require('web3');
const { get } = require('lodash');

const web3 = new Web3();
web3.setProvider(config.provider);

const parityApiInstance = new parityApi(new parityApi.Provider.Http(config.hostURL));

const utils = bytecodeUtils.init(config.hostURL);
const versions = require('../utils/solc-versions.json').builds.reverse();

router.get('/versions', (req, res) => {
  return res.json({
    success: true,
    data: {
      versions: versions
    }
  });
});

router.post('/verify', async (req, res) => {
  let { contractAddress, contractName, compilerVersion, contractCode, optimizerEnabled, contractDecodedParameters } = req.body;

  try {
    contractAddress = web3.utils.toChecksumAddress(contractAddress);
  } catch (error) {
    return res.json({
      success: false,
      error: 'The address is not valid.'
    });
  }


  let existContract = await Contracts.findOne({ address: contractAddress });

  if (existContract !== null) {
    return res.json({
      success: true,
      data: {
        contract: existContract
      }
    });
  }

  compilerVersion = `v${compilerVersion}`;

  let trace = {};

  const traces = await parityApiInstance.trace.filter({ fromBlock: '0x00', toAddress: [contractAddress] });

  traces.forEach((_trace) => {
    if (_trace.type === 'create' && _trace.result.address.toLowerCase() === contractAddress.toLowerCase() && !_trace.error) {
      trace = _trace;
    }
  });

  const comparisonResult = await utils.compareBytecode(contractAddress, compilerVersion, contractCode, contractName, optimizerEnabled ? 1 : 0);

  if (comparisonResult.error || !comparisonResult.match) {
    return res.json({
      success: false,
      error: 'Error while comparing bytecodes. Please review the parameters.'
    });
  } else {
    const { remoteCode, localCode, match, msg } = comparisonResult;
    let ts = (await web3.eth.getBlock(get(trace, 'blockNumber'))).timestamp;

    let contract = new Contracts({
      msg: msg,
      type: contractName,
      abi: JSON.parse(localCode.abi),
      block: get(trace, 'blockNumber'),
      timestamp: ts,
      gas: get(trace, 'action.gas').toString(),
      events: [],
      bytecode: remoteCode,
      address: contractAddress,
      txHash: get(trace, 'transactionHash'),
      value: get(trace, 'action.value').toNumber(),
      from: get(trace, 'action.from'),
      input: get(trace, 'action.init'),
      source: {
        code: contractCode,
        compilerVersion: compilerVersion,
        contractName: contractName,
        optimizerEnabled: optimizerEnabled,
        contractDecodedParameters: contractDecodedParameters,
        verified: match
      }
    });

    contract.save((error, savedContract) => {
      if (error) {
        return res.json({
          success: false,
          error: error.toString()
        });
      }

      return res.json({
        success: true,
        data: {
          contract: savedContract
        }
      });
    });
  }
});

router.get('/verified-contracts', async (req, res) => {
  let filter =  {
    'source.verified': true
  };

  Contracts.find(filter, (error, contracts) => {
    if(error)
      return res.json({success: false, error: error});

    return res.json({
      success: true,
      contracts: contracts
    });
  });
});

module.exports = router;
