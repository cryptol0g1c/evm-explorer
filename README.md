<div align="center">

<img src="https://bitsign.io/dist/de0a1c415444858ae585783c1e7e7e01.png" alt="BSG" width="375" />

##### EVM based explorer, with contract verifier and MetaMask integration.

</div>

- **[Official Website](https://explorer.bitsign.io/)**

<h2 align="center">Requirements</h2>

BitSign explorer currently only runs on Parity Nodes with fat_db and traces activated.

- Parity Software v1.1.11+ ([https://www.parity.io/](https://www.parity.io/))
- Bytecode Utils library ([https://www.npmjs.com/package/bytecode-utils](https://www.npmjs.com/package/bytecode-utils))
- React-Eth library ([https://www.npmjs.com/package/react-eth](https://www.npmjs.com/package/react-eth))
- Traces and Fat_db activated ([https://wiki.parity.io/Configuring-Parity-Ethereum](https://wiki.parity.io/Configuring-Parity-Ethereum))
- Privated or public EVM based blockchains ([https://wiki.parity.io/Proof-of-Authority-Chains](https://wiki.parity.io/Proof-of-Authority-Chains))

<h2 align="center">Live site</h2>

The latest version of the explorer can be found here! [Check it out &raquo;](https://explorer.bitsign.io)

<h2 align="center">Milestones</h2>

### v0.0.9 - Stable
![Progress](http://progressed.io/bar/90)

**Release Date**: 10/01/19

**0.0.9 Milestones**:
- [x] Bytecode-verifier integrated
- [x] React-eth library integrated to interact with verified contracts
- [x] Flow transaction direction represented with icons
- [x] RawTx tab added to inspect transaction result
- [x] Real time Socket to push latest transations to tables
- [x] Tab to display latest verified contracts
- [x] Integrated to MetaMask to write contract functions directly from the explorer
- [x] Contract function details on transaction view when browsing verified contracts
- [ ] RPC provider selector
- [ ] Stats viewer
- [ ] Enhance event tab
- [ ] Complete timeline tab


<h2 align="center">How to run</h2>

To install the dependencies tree:

```
$ npm i
```

For dev purposes, use webpack to build and launch React with:


```
$ npm run devmode
```
The application will launch automatically on the browser at:

http://localhost:8080




<h2 align="center">Using Docker Compose</h2>

Clone this repository and run:

```
$ docker-compose up
```

