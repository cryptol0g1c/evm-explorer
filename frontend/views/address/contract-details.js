import { Link } from 'react-router-dom';
import Code from './contract-details/code';
import Read from './contract-details/read';
import Write from './contract-details/write';
import React, { Component } from 'react';
import { EventsTable, TransactionsTable, TimelineTable, Nav } from '../../components';
import { startCase } from 'lodash';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';
import { hopscotch } from 'react-syntax-highlighter/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, List, Icon, Tabs, Popover, Timeline } from 'antd';
import web3 from 'web3';
import BigNumber from 'bignumber.js';

const TabPane = Tabs.TabPane;

const isMobile = window.innerWidth < 768;

export default class ContractDetails extends Component {

  state = {
    currentPanel: 'code'
  }

  handleButtonGroupClick = panel => this.setState({ currentPanel: panel })

  renderValue = key => {
    const contract = this.props.data.contract;
    const value = contract[key];
    let contractAddr = this.props.data.data.address;
    if(key === "Contract Address"){
      return (
        <span>
          <CopyToClipboard text={contractAddr}>
            <span style={{marginLeft: '4px'}}>{contractAddr}
              <Popover content={'Copied to Clipboard!'} trigger="click">
                <Icon style={styles.copy}
                  type="copy"
                  theme="twoTone"
                  twoToneColor="#7fa4e0" />
              </Popover>
            </span>
          </CopyToClipboard>
          <span> | </span>
          <Link to={`/verify-contract?address=${contractAddr}`}>
            <Button style={{marginBottom: '0', marginLeft: '4px'}} type="primary" size="small">
              Verify Contract<Icon type="right" />
            </Button>
          </Link>
        </span>
      )
    }
    if (key === 'from') {
      return (
        <Link style={styles.listValue} to={`/address/${value}`}>
          {value}
        </Link>
      );
    } else if (key === 'block') {
      return (
        <Link style={styles.listValue} to={`/block/${value}`}>
          {value}
        </Link>
      )
    } else if (key === 'value') {
      let ethBalance = value || '0';
      let bnBalance = new BigNumber(web3.utils.fromWei(ethBalance, 'ether'));

      return (bnBalance.toFormat(bnBalance.decimalPlaces())+ " ETH");

    } else if (key === 'txHash') {
      return (
        <Link style={styles.listValue} to={`/transaction/${value}`}>
          {value}
        </Link>
      )
    }
    return value;
  }

  renderTitle = item => {
    if (item === 'gas') {
      return 'Gas Used'
    }
    else if(item === 'value')
      return "Balance"
    else if(item === 'block')
      return "Created at block"
    else if(item === 'from')
      return "Created By"
    return startCase(item)
  }

  render() {
    const { data: { address, balance, isVerified }, contract, events, transactions: { transactions }, transactionsQty } = this.props.data;
    const dataList = [];

    dataList.push("Contract Address");

    Object.keys(contract).forEach(key => {
      return dataList.push(key)
    })

    dataList.splice(dataList.indexOf('input'), 1 );

    let ethBalance = balance || '0';
    let bnBalance = new BigNumber(web3.utils.fromWei(ethBalance, 'ether'));

    return (
      <div>
        {
          isVerified
            ? <div>
              <div style={styles.contractData}>
                <p style={styles.contractDataTitle}>
                  Contract data
              </p>
                <div style={styles.contractDataListWrapper}>
                  <ul style={styles.contractDataList_left}>
                    <li style={styles.contractDataListItem}>
                      <span>Contract Name: </span> <span style={styles.contractDataValue}>{contract.type}</span>
                    </li>

                    <li style={styles.contractDataListItem}>
                      <span>Balance:</span> <span style={styles.contractDataValue}>{bnBalance.toFormat(bnBalance.decimalPlaces())} Ether</span>
                    </li>

                    <li style={styles.contractDataListItem}>
                      <span>Transactions:</span> <span style={styles.contractDataValue}>{transactions.length} Txs</span>
                    </li>
                  </ul>

                  <ul style={styles.contractDataList_right}>
                    <li style={styles.contractDataListItem}>
                      <span>Contract Address:</span>
                      <CopyToClipboard style={styles.contractCreatorValue} text={address}>
                        <span style={{marginLeft: '4px'}}>
                          {address}
                          <Popover content={'Copied to Clipboard!'} trigger="click">
                            <Icon style={styles.copy}
                              type="copy"
                              theme="twoTone"
                              twoToneColor="#7fa4e0" />
                          </Popover>
                        </span>
                      </CopyToClipboard>
                    </li>

                    <li style={styles.contractDataListItem}>
                      <span>Contract creator:</span> <span style={styles.contractCreatorValue}>
                        <Link to={`/address/${contract.from}`}>{contract.from}</Link>
                      </span>
                    </li>

                    <li style={styles.contractDataListItem}>
                      <span>Creation block:</span> <span style={styles.contractCreatorValue}>
                        <Link to={`/block/${contract.block}`}>{contract.block}</Link>
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <div style={styles.table}>
                <Tabs defaultActiveKey="1" className={styles.listMargin}>
                  <TabPane tab="Transactions" key="1">
                    <TransactionsTable
                      noTitle={true}
                      transactions={transactions}
                      emptyText={`There are not transactions in the last ${transactionsQty} blocks`}
                    />
                  </TabPane>

                  <TabPane tab="Code" key="2">
                    <Code {...this.props.data} />
                  </TabPane>

                  <TabPane tab="Read" key="3">
                    <Read {...this.props.data} />
                  </TabPane>

                  <TabPane tab="Write" key="4">
                    <Write {...contract} />
                  </TabPane>

                  <TabPane tab="Events" key="5">
                    <EventsTable
                      noTitle={true}
                      events={events}
                      emptyText={`No events triggered yet`}
                    />
                  </TabPane>

                  <TabPane tab="Timeline" key="6">
                    <TimelineTable
                      transactions={transactions}
                      emptyText={`No events triggered yet`}
                    />
                  </TabPane>

               </Tabs>

              </div>
            </div>
            : <div className='contract'>

                <List
                  size="medium"
                  bordered
                  dataSource={dataList}
                  style={styles.listMargin}
                  renderItem={item => (<List.Item style={{alignItems: 'center'}}><b>{this.renderTitle(item)}</b>: {this.renderValue(item)}</List.Item>)}
                />
                <div style={styles.content}>
                  <div style={styles.headerWrapper}>
                    <p style={styles.title}><b>Contract Bytecode</b></p>
                    <CopyToClipboard text={contract.input}>
                      <Popover content={'Copied to Clipboard!'} trigger="click">
                        <Icon style={styles.copy}
                          type="copy"
                          theme="twoTone"
                          twoToneColor="#7fa4e0" />
                      </Popover>
                    </CopyToClipboard>
                  </div>

                  <SyntaxHighlighter
                    wrapLines
                    style={hopscotch}>
                    {contract.input}
                  </SyntaxHighlighter>
                </div>

              </div>
        }
      </div>
    );
  }
}

const styles = {
  listMargin: {
    margin: '20px 0'
  },
  content: {
    marginTop: '2rem'
  },
  title: {
    marginBottom: 0
  },
  headerWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  contractData: {
    marginBottom: '1rem',
    marginTop: '1rem'
  },
  contractDataTitle: {
    borderBottom: '1px solid lightgray',
    marginBottom: '0.5rem'
  },
  contractDataValue: {
    float: 'right',
    display: 'inline-block',
    width: '50%'
  },
  contractCreatorValue: {
    float: 'right',
    display: 'inline-block',
    width: '70%'
  },
  contractDataListItem: {
    marginBottom: '0.5rem',
    height: isMobile ? '2rem' : null
  },
  detailsButton: {
    borderRadius: 0,
    textTransform: 'capitalize'
  },
  panel: {
    border: '1px solid lightgray',
    padding: '1rem'
  },
  contractDataList_left: {
    width: isMobile ? '100%' : '40%',
    fontSize: isMobile ? '0.75rem' : null
  },
  contractDataList_right: {
    width: isMobile ? '100%' : '60%',
    fontSize: isMobile ? '0.75rem' : null
  },
  contractDataListWrapper: {
    display: isMobile ? 'block' : 'flex'
  },
  goToVerifyLink: {
    textDecoration: 'none'
  },
  goToVerifyLinkText: {
    color: 'white'
  },
  listTitle: {
    fontWeight: 'bold',
    marginRight: 10
  },
  input: {
    wordBreak: 'break-all',
    marginLeft: '4px'
  },
  buttonMargin: {
    marginBottom: 10
  },
  listValue: {
    marginLeft: '4px'
  },
  margin: {
    marginBottom: '2rem'
  },
  copy: {
    cursor: 'copy',
    marginLeft: '4px'
  },
  table: {
    display: isMobile ? 'flex' : 'block',
    width: isMobile ? '100%' : null
  }
};
