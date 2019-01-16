const config = require('../config');
const express = require('express');
const getTxsOnBlock = require('./utils/getTxsOnBlock');
const router = express.Router();
const Web3 = require('web3');
const _ = require('lodash');

const MAX_INITIAL_BLOCKS = 100;
const web3 = new Web3();

web3.setProvider(config.provider);

router.get('/', async (req, res) => {
  let blockCount = MAX_INITIAL_BLOCKS;

  const { number } = await web3.eth.getBlock('latest');

  if (number - MAX_INITIAL_BLOCKS < 0) {
    blockCount = number + 1;
  }

  let transactions = [];
  let blocks = await Promise.all(
    _.times(blockCount, async (t) => await web3.eth.getBlock(number - t)
      .then(blockData => {
        const { number, miner, timestamp, uncles } = blockData;

        transactions = [...transactions, ...blockData.transactions];

        return {
          number,
          miner,
          timestamp,
          tx: blockData.transactions.length,
          uncles: uncles.length
        };
      }))
  );

  return res.json({
    success: true,
    data: {
      blocks,
      maxBlocks: MAX_INITIAL_BLOCKS,
      transactions: await getTxsOnBlock(web3, transactions)
    }
  });
});

module.exports = router;
