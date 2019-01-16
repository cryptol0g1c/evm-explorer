import React, { Component } from 'react';
import { Modal } from 'antd';
import PropTypes from 'prop-types';
import Web3 from 'web3';
import { isEmpty } from 'lodash';
import { Form, Input } from 'antd';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { hopscotch } from 'react-syntax-highlighter/styles/prism';

const FormItem = Form.Item;

const web3 = new Web3(Web3.givenProvider);

class TransactionModal extends Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired
  }

  static defaultProps = {
    abi: {},
    params: {}
  }

  constructor(props) {
    super(props);

    this.state = {
      error: null,
      value: 0
    };
  }

  componentWillReceiveProps = async (nextProps) => {
    if (!this.props.isOpen && nextProps.isOpen) {
      this.setState({
        gasPrice: await this.getGasPrice(),
        //estimatedGas: await this.getEstimatedGas(),
        value: 0
      });
    }
  }

  toggleModal = () => {
    this.props.toggle({});
  }

  onAccept = async () => {
    this.setState({
      estimatedGas: await this.getEstimatedGas()
    });

    if (this.state.error) 
      return;

    if (this.props.abi.payable && this.state.value <= 0) {
      this.setState({
        error: 'Value must be higher than 0'
      });
    } else {
      this.props.onAccept(this.props.method, this.props.params, {
        from: this.props.sender,
        gas: this.state.estimatedGas,
        gasPrice: this.state.gasPrice,
        value: this.props.abi.payable ? web3.utils.toWei(this.state.value, 'ether') : 0
      });

      this.toggleModal();
    }
  }

  getGasPrice = async () => {
    try {
      return await web3.eth.getGasPrice();
    } catch (error) {
      this.props.onError('Error getting gas price.');
    }
  }

  getEstimatedGas = async () => {
    const { params, abi, sender, method, instance } = this.props;

    try {
      const gas = await instance.methods[method](...Object.values(params)).estimateGas({
        from: sender,
        value: abi.payable
          ? web3.utils.toWei(this.state.value, 'ether')
          : null
      });

      this.setState({
        error: null
      });

      return gas;
    } catch (error) {
      this.setState({
        error: 'Error estimating gas.'
      });
    }
  }

  handleValueChange = (event) => {
    this.setState({
      value: event.target.value
    });
  }

  createWeb3Tx = (txParams) => {
    if(txParams != undefined){
      try {
        let w3 = `
      web3.eth.signTransaction({
        to: ${txParams.to},
        gasPrice: ${txParams.gasPrice},
        gas: ${txParams.gas},
        value: ${txParams.value},
        nonce: ${txParams.nonce},
        data: ${txParams.data}
      }).then(console.log);
    `;

        return w3;
      } catch (error) {
        return error;
      }
    }
  }

  render() {
    const { address, abi, method, params, contractRawMethod = '-', rawSerializedTx, txParams } = this.props;
    const { estimatedGas, gasPrice, error } = this.state;

    return (
      <Modal
        //contentClassName={'modalContent'}
        visible={this.props.isOpen}
        onOk={this.onAccept}
        onCancel={this.toggleModal}
        okText="Sign & Send"
        cancelText="Cancel">

        <h6>Create Transaction</h6>

        <ul>
            <li>
              <b>To:</b> {address}
            </li>

            <li>
              <b>Contract Function:</b> {method}
            </li>

            {
              !isEmpty(params) &&
              <li>
                <b>Params:</b>

                <ul style={styles.paramsMenu}>
                  {
                    Object.keys(params).map((key, index) =>
                      <li key={index}>
                        <b>{key}:</b> {params[key]}
                      </li>
                    )
                  }
                </ul>
              </li>
            }

            {
              estimatedGas &&
              <li>
                <b>Gas: </b> {estimatedGas}
              </li>
            }

            {
              gasPrice &&
              <li>
                <b>GasPrice: </b> {gasPrice} WEI
              </li>
            }

            {
              abi.payable &&
              <li>
                <FormItem style={styles.addressFormField}
                  validateStatus={Boolean(error) ? "error" : null}
                  help={error}
                >
                  <label><b>Value to send (in ETH)</b></label>
                  <Input
                    type='number'
                    name='value'
                    id='value'
                    value={this.state.value}
                    onChange={this.handleValueChange}
                    />
                </FormItem>
              </li>
            }
        </ul>
        <div>

          {/* <b>txParams</b>
          <SyntaxHighlighter
            wrapLines
            style={hopscotch}>
            {this.createWeb3Tx(this.props.txParams)}
          </SyntaxHighlighter> */}

          <b>Contract signature function</b>
          <SyntaxHighlighter
            wrapLines
            style={hopscotch}>
            {contractRawMethod}
          </SyntaxHighlighter>

          {/* <b>Unsigned Serialized raw Bytecode</b>
          <SyntaxHighlighter
            wrapLines
            style={hopscotch}>
            {rawSerializedTx}
          </SyntaxHighlighter> */}
        </div>

      </Modal>
    );
  }
}

const styles = {
  paramsMenu: {
    marginLeft: 10
  },
  listItem: {
    marginBottom: 5
  }
}

export default TransactionModal;
