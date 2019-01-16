import './_write.scss';

import React, { Component } from 'react';
import EthForm from 'react-eth/dist';
import Web3 from 'web3';
import { isEmpty } from 'lodash';
import { TransactionModal, TransactionSuccess } from '../../../components';
import { connect } from 'react-redux';
import { get } from '../../../services';
import { List, Spin, notification, message } from 'antd';

const web3 = new Web3(Web3.givenProvider);

const isMobile = window.innerWidth < 768;

const openNotificationWithIcon = (error) => {
  notification['error']({
    message: 'Error!',
    description: error,
  });
};

class Write extends Component {

  constructor(props) {
    super(props);

    this.state = {
      address: '',
      isTxModalOpen: false,
      txSuccessData: null,
      loading: false
    };
  }

  componentDidMount() {
    this.getAccounts();

    this.getInstance();
  }

  getAccounts = async () => {
    const net = await web3.eth.net.getId();

    await web3.givenProvider.enable();

    if (net === 8995) {
      const accounts = await web3.eth.getAccounts();
      if (!isEmpty(accounts)) {
        this.setState({
          address: accounts[0]
        });
      }
    }
  }

  getInstance = () => {
    const { abi, address } = this.props;

    this.setState({
      instance: new web3.eth.Contract(abi, address)
    });
  }

  handleSubmit = async (method, params) => {
    if (!this.state.address) {
      this.getAccounts();
    }

    const { address } = this.state;

    try {

      let contractRawMethod = await this.state.instance.methods[method](...Object.values(params)).encodeABI();
      // let contractAddress = this.state.instance._address;
      // let gasPrice = await web3.eth.getGasPrice();
      // let accountNonce = await web3.eth.getTransactionCount(address);
      // let chainId = await web3.eth.net.getId();
      // let estimatedGas = await web3.eth.estimateGas({
      //   to: contractAddress,
      //   data: contractRawMethod
      // });

      // let txParams = {
      //   chainId: chainId,
      //   nonce: accountNonce,
      //   to: contractAddress,
      //   gas: estimatedGas,
      //   gasPrice: gasPrice,
      //   gasLimit: '4465000',
      //   value: '0',
      //   data: contractRawMethod
      // };

      // let rawTx = new ethTx(txParams);
      // let rawSerializedTx = '0x'+rawTx.serialize().toString('hex');

      if (address) {
        this.toggleTxModal({
          method,
          params,
          address: this.props.address,
          sender: this.state.address,
          abi: this.props.abi.find(({ name }) => name === method),
          instance: this.state.instance,
          onAccept: this.onAccept,
          onError: this.onError,
          contractRawMethod: contractRawMethod,
          // txParams: txParams,
          // rawSerializedTx: rawSerializedTx
        });
      } else {
        message.alert('Please unlock / connect Metamast to proper Network.');
      }

    } catch (error) {
      message.alert(error.toString());
    }

  }

  onAccept = async (method, params, options) => {
    try {
      this.setState({
        loading: true
      });

      const results = await this.state.instance.methods[method](...Object.values(params)).send(options);

      if (this.state.isTxModalOpen) {
        this.toggleTxModal({});
      }

      if (results.status) {
        get(`/api/address/${this.props.address}`, this.props.dispatch);
      }

      this.setState({
        txSuccessData: results,
        loading: false
      });
    } catch (error) {
      this.setState({
        loading: false
      });
      openNotificationWithIcon(error.toString())
    }
  }

  onError = (error) => {
    this.setState({
      loading: false,
      isTxModalOpen: false
    }, () => message.alert(error));
  }

  toggleTxModal = data => {
    this.setState({
      isTxModalOpen: !this.state.isTxModalOpen,
      txModalData: data
    });
  }

  render() {
    const { abi } = this.props;

    return (
      <div className='write'>
        <Spin spinning={this.state.loading} size="large">
          <ul className='ant-list ant-list-lg ant-list-split ant-list-bordered'>
            <TransactionSuccess
              data={this.state.txSuccessData}
              toggle={() => this.setState({ txSuccessData: null })}
            />
            
            <List
            size={isMobile ? 'small' : 'medium'}
            itemLayout='vertical'>
            {
              abi.filter(f => !f.constant && f.type === 'function').map((func, index) =>
                <List.Item key={`abiItem-${index}`}>
                  <EthForm
                    abi={func}
                    onSubmit={({ formData }) => this.handleSubmit(func.name, formData)} />
                </List.Item>
              )
            }
            </List>
          </ul>
        </Spin>

        <TransactionModal
          {...this.state.txModalData}
          isOpen={this.state.isTxModalOpen}
          toggle={this.toggleTxModal} />
      </div>
    );
  }
}

const mapDispatchToProps = ({ loading }) => loading;

export default connect(mapDispatchToProps)(Write);
