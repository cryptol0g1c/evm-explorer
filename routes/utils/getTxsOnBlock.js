module.exports = (web3, transactions) => {
  return Promise.all(transactions.map(async (tx) => {
    const txData = await web3.eth.getTransaction(tx);

    return {
      block: txData.blockNumber,
      blockHash: txData.blockHash,
      from: txData.from,
      hash: txData.hash,
      input: txData.input,
      to: txData.to ? txData.to : txData.creates,
      value: txData.value
    };
  }));
};
