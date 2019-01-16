const express = require('express');
const router = express.Router();
const Web3 = require('web3');
const _ = require('lodash');

router.get('/:block', async (req, res) => {
  const config = req.app.get('config');
  const web3 = new Web3();

  web3.setProvider(config.provider);

  try {
    const blockData = await web3.eth.getBlock(req.params.block, true);
    const transactions = await Promise.all(blockData.transactions.map(async (tx) => {
      const txData = await web3.eth.getTransaction(tx.hash);

      return {
        block: txData.blockNumber,
        blockHash: txData.blockHash,
        hash: txData.hash,
        from: txData.from,
        input: txData.input,
        to: txData.to ? txData.to : txData.creates,
        value: txData.value
      };
    }));

    res.json({
      success: true,
      data: {
        blockDetails: Object.assign({}, _.pick(blockData, ['parentHash', 'hash', 'number', 'miner', 'author', 'extraData', 'timestamp', 'gasLimit', 'gasUsed', 'size']), {
          transactions: blockData.transactions.length,
          uncles: blockData.uncles.length
        }),
        transactions
      }
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      error: error.toString()
    });
  }
});

module.exports = router;
