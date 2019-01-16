const config = require('../config');
const Contracts = require('../models/contracts');
const express = require('express');
const isMiner = require('./utils/isMiner');
const moment = require('moment');
const parity = require('@parity/api');
const Promise = require('bluebird');
const router = express.Router();
const Web3 = require('web3');
const _ = require('lodash');

const web3 = new Web3();
web3.setProvider(config.provider);

let parityProvider = new parity.Provider.Http(config.hostURL);
let parityInstance = new parity(parityProvider);

const MAX_BLOCKS = 100;

const getBlockData = async (blockNumber) => {
  const block = await web3.eth.getBlock(blockNumber);

  return {
    block: blockNumber,
    date: moment.unix(block.timestamp).format('HH:mm DD/MM/YYYY'),
    gasUsed: block.gasUsed,
    txs: block.transactions.length
  };
};

//TODO: ABRIR ISSUE EN PARITY el filter fromAddress no funciona
const getTxsByAddress = async (address, last) => {
  try {
    let blocks = await parityInstance.trace.filter({
      fromBlock: last - MAX_BLOCKS,
      // fromAddress: [address],
      // toAddress: [address]
    });
    let minedBlocks = [];
    let transactions = [];

    blocks.map((block) => {
      if (block.type === 'call') {
        if(block.action.to == address || block.action.from == address){
          transactions.push({
            block: block.blockNumber,
            from: block.action.from,
            hash: block.transactionHash,
            input: block.action.input,
            to: block.action.to,
            value: block.action.value.toString(),
            reverted: block.error === 'Reverted'
          });
        }
      } else if (block.type === 'reward') {
        minedBlocks.push({
          block: block.blockNumber
        });
      }
    });

    minedBlocks = await Promise.all(minedBlocks.map(async ({ block }) => {
      return await getBlockData(block);
    }));

    return {
      minedBlocks,
      transactions
    };
  } catch (error) {

    return{
      success: false,
      error: error
    };
  }
};

const getFormattedOutputs = (name, values, outputs) => {
  return {
    name,
    outputs: typeof values === 'object'
      ? _.zipWith(Object.values(values), outputs, (value, { type }) => ({ value, type }))
      : [{
        value: values,
        type: outputs[0].type
      }]
  };
};

router.get('/:address', async (req, res) => {
  let { address } = req.params;

  address = web3.utils.toChecksumAddress(address);

  let contract = {};
  let events = [];
  let readValues = [];
  let currentBlock = await web3.eth.getBlockNumber();
  let isVerified = false;
  let isContract = await web3.eth.getCode(address) !== '0x';

  if (isContract) {
    contract = await Contracts.findOne({ address });

    if (contract !== null && contract.abi) {
      const contractInstance = new web3.eth.Contract(contract.abi, address);
      const readOnlyFunctions = contract.abi.filter(c => c.stateMutability === 'view' && _.isEmpty(c.inputs));

      isVerified = true;

      try {
        readValues = await Promise.map(readOnlyFunctions, async ({ name, outputs }) => {
          let values = await contractInstance.methods[name]().call();

          return getFormattedOutputs(name, values, outputs);
        });
      } catch (error) {
        console.log('Error fetching read only results: ', error);
      }

      try {
        events = await contractInstance.getPastEvents('allEvents', {
          fromBlock: 0,
          toBlock: currentBlock
        });
      } catch (error) {
        console.log('Error fetching all past events: ', error);
      }
    }

    if (_.isEmpty(contract)) {
      try {
        const traces = await parityInstance.trace.filter({ fromBlock: 0, toAddress: [address] });

        const contractRuntimeCode = await web3.eth.getCode(address);
        traces.forEach((trace) => {
          if (trace.type === 'create' && trace.result.address.toLowerCase() === address.toLowerCase() && !trace.error) {
            contract = {
              block: _.get(trace, 'blockNumber'),
              from: _.get(trace, 'action.from'),
              txHash: _.get(trace, 'transactionHash'),
              gas: _.get(trace, 'action.gas').toString(),
              value: _.get(trace, 'action.value').toString(),
              input: contractRuntimeCode,
            };
          } else if (trace.type === 'call') {
            contract = {
              block: _.get(trace, 'blockNumber'),
              from: _.get(trace, 'action.from'),
              txHash: _.get(trace, 'transactionHash'),
              gas: _.get(trace, 'action.gas').toString(),
              value: _.get(trace, 'action.value').toString(),
              input: contractRuntimeCode,
            };
          }
        });
      } catch (error) {
        return res.json({
          success: false,
          error: error
        });
      }
    } //isEmpty
  }//isContract

  let data = {
    address: address,
    balance: await web3.eth.getBalance(address),
    isContract: isContract,
    isVerified: isVerified
  };

  return res.json({
    success: true,
    data: {
      data: data,
      contract: contract,
      events: events,
      readValues: readValues,
      transactions: await getTxsByAddress(address, currentBlock),
      transactionsQty: isMiner(address) ? MAX_BLOCKS : currentBlock
    }
  });
});

router.post('/:address/:method', async (req, res) => {
  const { address, method } = req.params;
  const { params } = req.body;

  try {
    const contract = await Contracts.findOne({ address });
    const contractInstance = new web3.eth.Contract(contract.abi, address);

    return res.json({
      success: true,
      data: getFormattedOutputs(
        method,
        await contractInstance.methods[method](...params).call(),
        contract.abi.find(({ name }) => method === name).outputs
      )
    });
  } catch (error) {
    return res.json({
      success: false,
      error: error.toString()
    });
  }
});

module.exports = router;
