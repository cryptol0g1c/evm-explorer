const bodyParser = require('body-parser');
const config = require('./config');
const express = require('express');
const getTxsOnBlock = require('./routes/utils/getTxsOnBlock');
const mongoose = require('mongoose');
const path = require('path');
const Web3 = require('web3');

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const web3 = new Web3();
const web3Ws = new Web3();

web3.setProvider(config.provider);
web3Ws.setProvider(config.wsProvider);

io.on('connection', client => {
  try {
    web3Ws.eth.subscribe('newBlockHeaders', async (error, { number }) => {
      if (!error) {
        const newBlock = await web3.eth.getBlock(number);
        const transactions = await getTxsOnBlock(web3, newBlock.transactions);

        client.emit('new_block', JSON.stringify({
          block: {
            number: newBlock.number,
            miner: newBlock.miner,
            timestamp: newBlock.timestamp,
            tx: newBlock.transactions.length,
            uncles: newBlock.uncles.length
          },
          transactions
        }));
      }
    });
  } catch (error) {
    console.log('Error on ws', error);
  }

  client.on('disconnect', () => { });
});

mongoose.connect(config.mongoUri, { useNewUrlParser: true }, error => {
  if (error) {
    console.log(`[+] MongoDB ${error}`);
  } else {
    console.log('[+] Connected to MongoDB');
  }
});

app.set('port', process.env.PORT || 8080);
app.set('config', config);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname));
app.use('/favicon.ico', express.static(path.join(__dirname, 'dist', 'ethereum-logo.png')));

app.use('/api/address', require('./routes/address'));
app.use('/api/block', require('./routes/block'));
app.use('/api/blocks', require('./routes/blocks'));
app.use('/api/contract', require('./routes/contract'));
app.use('/api/transaction', require('./routes/tx'));

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'dist', 'index.html')));

http.listen(app.get('port'), () => {
  console.log(`App running on port ${app.get('port')}`);
});

module.exports = app;
