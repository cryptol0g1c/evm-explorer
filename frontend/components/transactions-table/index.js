import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Tooltip, Icon } from 'antd';
import numeral from 'numeral';
import web3 from 'web3';
import { BigNumber } from 'bignumber.js';

const isMobile = window.innerWidth < 768;

class TransactionsTable extends Component {

  static propTypes = {
    transactions: PropTypes.array
  }

  static defaultProps = {
    noTitle: false,
    transactions: []
  }

  constructor(props) {
    super(props);

    this.state = {
      sorter: {
        field: 'block',
        order: 'descend'
      }
    };
  }

  getColumns = () => {
    const { sorter } = this.state;

    return [{
      title: 'Block',
      dataIndex: 'block',
      align: 'center',
      sorter: (a, b) => {
        return a.block - b.block;
      },
      sortOrder: sorter.field === 'block' && sorter.order,
      render: (block) => {
        return <Link to={`/block/${block}`}>
          {numeral(block).format('0,0')}
        </Link>;
      },
      },{
      title: 'Transaction Hash',
      dataIndex: 'hash',
      align: 'center',
      render: (hash) => {
        let h = hash;
        let lh = h.substring(0, 10);
        let hh = h.substring(57, 67)
        let truncHash = lh + ' ... ' + hh;

        return (
          <Tooltip placement='top' title={hash}>
            <Link to={`/transaction/${hash}`}>
              {truncHash}
            </Link>
          </Tooltip>
        );
      },
    }, {
      title: 'From Address',
      dataIndex: 'from',
      align: 'center',
      render: (from) => {
        let f = from;
        let lf = f.substring(0, 6);
        let hf = f.substring(36, 43)
        let truncFrom = lf + ' ... ' + hf;
        return (
          <Tooltip placement='top' title={from}>
            <Link to={`/address/${from}`}>
              {truncFrom}
            </Link>
          </Tooltip>
        );
      },
    },
    {
      title: 'To Address',
      dataIndex: 'to',
      align: 'center',
      render: (to) => {
        let t = to;
        let lt = t.substring(0, 6);
        let ht = t.substring(36, 43)
        let truncTo = lt + ' ... ' + ht;
        return (
          <Tooltip placement='top' title={to}>
            <Link to={`/address/${to}`}>
              {truncTo}
            </Link>
          </Tooltip>
        );
      },
    },
    this.props.address ?
    {
      align: 'center',
      key: 'arrow',
      title: 'Flow',
      width: 100,
      render: item => {
        if (item.from === this.props.address) {
          return (
            <Icon type="up-circle" theme="twoTone" twoToneColor="#de1b1b" />
          );
        } else {
          return (
            <Icon type="down-circle" theme="twoTone" twoToneColor="#1fd219" />
          );
        }
      }
    } : {}
    ,{
      title: 'Value',
      dataIndex: 'value',
      align: 'center',
      render: (v) => {
        let ethBalance = v || '0';
        let bnBalance = new BigNumber(web3.utils.fromWei(ethBalance, 'ether'));
        return (
          <span>{bnBalance.toFormat(bnBalance.decimalPlaces())} ETH</span>
        );
      },
    },
    {
      title: 'Input',
      dataIndex: 'input',
      align: 'center',
      render: (v) => {
        if (v == '0x') return (<b>{'Value Transfer Transaction'}</b>);
        return (<b>{'Contract / Metadata Transaction'}</b>)
      }
    }];
  }

  render() {
    const { style, transactions, emptyText } = this.props;

    return (
      <div style={style}>
        {
          transactions.length
            ? <div className='table-noBreak'>
              <Table
                rowKey='block'
                columns={this.getColumns()}
                dataSource={transactions}
                scroll={{x: true}}
                size={isMobile ? 'small' : 'default'}
                onChange={(pagination, filters, sorter) => {
                  this.setState({
                    sorter: {
                      field: sorter.field,
                      order: sorter.order
                    }
                  })
                }} />
            </div>
            : <span style={styles.emptyText}>{emptyText}</span>
        }
      </div>
    );
  }
}

const styles = {
  tableWrapper: {
    height: '100%'
  },
  emptyText: {
    textAlign: 'center'
  }
}

export default TransactionsTable;
