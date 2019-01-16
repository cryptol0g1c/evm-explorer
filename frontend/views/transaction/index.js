import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Async, Nav } from '../../components';
import { connect } from 'react-redux';
import { get as getTransactionData } from '../../services';
import { get, startCase } from 'lodash';
import { Link } from 'react-router-dom';
import Web3 from 'web3';
import { List, Icon, Tabs, Popover } from 'antd';
import BigNumber from 'bignumber.js';
import moment from 'moment';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { hopscotch } from 'react-syntax-highlighter/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';

const TabPane = Tabs.TabPane;
const web3 = new Web3(Web3.givenProvider);
const isMobile = window.innerWidth < 768;

class Transaction extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  static defaultProps = {
    data: {}
  }

  static defaultProps = {
    data: {}
  }

  componentDidMount = () => {
    getTransactionData(`/api/transaction/${get(this.props, 'match.params.hash')}`, this.props.dispatch);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.history.location.pathname !== prevProps.location.pathname) {
      getTransactionData(`/api/transaction/${get(this.props, 'match.params.hash')}`, this.props.dispatch);
    }
  }

  renderParameters = value => {
    return value.inputs.map(({ type, name }, index) =>
      <span key={`parameter-${index}`}>
        {type} {name} {index === value.inputs.length ? ', ' : null}
      </span>
    );
  }

  renderValue = key => {
    const { txDetails = {} } = this.props.data;
    const value = txDetails[key];

    if (key === 'from' || key === 'to' || key === 'creates') {
      return (
        <Link to={`/address/${value}`}>
          {value}
        </Link>
      )
    } else if (key === 'blockNumber') {
      return (
        <Link to={`/block/${value}`}>
          {value}
        </Link>
      )
    } else if (key === 'value') {
      let ethBalance = value || '0';
      let bnBalance = new BigNumber(web3.utils.fromWei(ethBalance, 'ether'));
      return (
        <span>&nbsp;{bnBalance.toFormat(bnBalance.decimalPlaces())} ETH</span>
      )
    } else if (key === 'receipt') {
        if(value)
          return (<span> &nbsp;Confirmed <Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a" /></span>)
        else
          return (<span> &nbsp;Reverted <Icon type="close-circle" theme="twoTone" twoToneColor="#ea380b" /></span>)
    } else if (key === 'input' && typeof value === 'object') {
      return (
        <div>
          <p>
            <b>Function</b> {value.name}({this.renderParameters(value)})
          </p>

          <ul>
            {
              value.inputs.map((i, index) =>
                <div key={`input-${index}`}>
                  [{index}]: {i.input}
                </div>
              )
            }
          </ul>
        </div>
      )
    } else if (key === 'gasPrice') {
      return (
        web3.utils.fromWei(value, 'ether') + ' GWEI'
      )
    } else if (key === 'timestamp') {
      return(
        moment(value*1000).format()
      )
    } else if (key === 'hash') {
      return(
        <CopyToClipboard text={value}>
          <span>{value}
          <Popover content={'Copied to Clipboard!'} trigger="click">
            <Icon style={{marginLeft: '4px'}}
              type="copy"
              theme="twoTone"
              twoToneColor="#7fa4e0"/>
          </Popover>
          </span>
        </CopyToClipboard>

      )
    }
    return value;
  }

  renderTitle = item => {
    if (item === 'creates')
      return 'New contract address'
    else if(item === 'receipt')
      return "Status";

    return startCase(item)
  }

  getTitle = key => {
    if (key === 'input' && typeof key !== 'string') {
      return null;
    }

    return key === 'creates' ? 'New Contract Address:' : `${startCase(key)}:`;
  }


  render() {
    const { txDetails = { input: 'Loading' }, rawTx } = this.props.data;
    const data = [];

    Object.keys(txDetails).forEach(key => {
      return data.push(key)
    })

    data.splice(data.indexOf('input'), 1);

    return (
      <Async {...this.props}>
        <Nav location={this.props.location.pathname}/>
          <List
            header={<h4>Transaction {txDetails.to ? '' : 'Contract Creation'}</h4>}
            size={isMobile ? 'small' : 'medium'}
            bordered
            style={styles.listMargin}
            dataSource={data}
            renderItem={item => (
              txDetails[item] ? <List.Item><b>{this.renderTitle(item)}</b>: 
                <div style={styles.divItem}> {this.renderValue(item)}</div></List.Item> 
              : <div />
            )}
          />

        <div style={styles.content}>

          <Tabs defaultActiveKey="1" className={styles.listMargin}>
            <TabPane tab={(typeof(txDetails.input) == 'string') ? 'Input Bytecode' : 'Function executed & inputs'} key="1">
            {
              (typeof(txDetails.input) == 'string')
              ? <CopyToClipboard text={txDetails.input}>
                  <Popover content={'Copied to Clipboard!'} trigger="click">
                    <Icon style={styles.copy}
                      type="copy"
                      theme="twoTone"
                      twoToneColor="#7fa4e0" />
                  </Popover>
                </CopyToClipboard>
              : null
            }

            {
              (typeof(txDetails.input) == 'string')
              ? <SyntaxHighlighter
                  wrapLines
                  style={hopscotch}>
                  {txDetails.input}
                </SyntaxHighlighter>
              :
                <div>
                  <span><i>function</i> <b> {txDetails.input.name}()</b></span>
                  <br/>
                  <br/>
                  <span>
                    {
                      txDetails.input.inputs.map((d, i ) => {
                        return(
                          <span key={i}>
                            <p><i>Parameter Name</i>: <b>{d.name}</b></p>
                            <p><i>Parameter Value:</i> <b>{d.input}</b></p>
                            <p><i>Parameter Type:</i> <b>{d.type}</b></p>
                          </span>
                        )
                      })
                    }
                  </span>
                </div>
            }
            </TabPane>

            <TabPane tab="Raw Tx" key="2">

              <CopyToClipboard text={JSON.stringify(rawTx)}>
                <Popover content={'Copied to Clipboard!'} trigger="click">
                  <Icon style={styles.copy}
                    type="copy"
                    theme="twoTone"
                    twoToneColor="#7fa4e0" />
                </Popover>
              </CopyToClipboard>

              <SyntaxHighlighter
                wrapLines
                style={hopscotch}>
                {JSON.stringify(rawTx)}
              </SyntaxHighlighter>

            </TabPane>
          </Tabs>

        </div>
      </Async>
    );
  }
}

const styles = {
  content: {
    marginTop: '2rem'
  },
  title: {
    marginBottom: 0
  },
  listMargin: {
    margin: '20px 0'
  },
  headerWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  input: {
    marginLeft: '98%',
  },
  copy: {
    cursor: 'copy',
    marginLeft: '98%',
  },
  span: {
    color: 'gray',
    fontStyle: 'italic',
    fontSize: '14px',
    marginLeft: '4px'
  },
  divItem: {
    wordBreak: 'break-all',
    marginLeft: '4px'
  }
};

const mapDispatchToProps = ({ loading }) => loading;

export default connect(mapDispatchToProps)(Transaction);
