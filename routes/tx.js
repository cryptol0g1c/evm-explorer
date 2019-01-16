const Contracts = require('../models/contracts');
const config = require('../config');
const express = require('express');
const InputDataDecoder = require('ethereum-input-data-decoder');
const router = express.Router();
const Web3 = require('web3');
const _ = require('lodash');

const web3 = new Web3();
web3.setProvider(config.provider);

router.get('/:tx', async (req, res) => {
  const { tx } = req.params;
  let txData;

  try {
    txData = await web3.eth.getTransaction(tx);
    txData.receipt = (await web3.eth.getTransactionReceipt(tx)).status;

    if (!txData) {
      return res.json({
        success: false,
        error: 'Sorry, we are unable to locate this transaction hash'
      });
    }

    txData.timestamp = (await web3.eth.getBlock(txData.blockNumber)).timestamp;
  } catch (error) {
    return res.json({
      success: false,
      error: error.toString()
    });
  }

  const contractInstance = await Contracts.findOne({ address: txData.to });

  if (contractInstance) {
    const decoder = new InputDataDecoder(contractInstance.abi);
    const decodedData = decoder.decodeData(txData.input);
    const abi = contractInstance.abi.find(({ name }) => name == decodedData.name);

    txData.input = {
      name: decodedData.name,
      inputs: _.zipWith(decodedData.types, decodedData.inputs, abi.inputs, (type, input, { name }) => ({ type, input, name }))
    };
  }

  return txData
    ? res.json({
      success: true,
      data: {
        txDetails: Object.assign({}, _.pick(txData, ['hash', 'blockHash', 'blockNumber', 'timestamp', 'from', 'to', 'creates', 'gas', 'gasPrice', 'nonce', 'value', 'receipt', 'input'])),
        rawTx: txData
      }
    })
    : res.json({
      success: false,
      error: 'Information of this tx cannot be retrieved.'
    });
});

module.exports = router;
