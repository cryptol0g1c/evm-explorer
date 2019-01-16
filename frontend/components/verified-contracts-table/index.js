import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { Table, Tooltip } from 'antd';
import numeral from 'numeral';
import moment from 'moment';

const isMobile = window.innerWidth < 768;

class VerifiedContractsTable extends Component {

  static propTypes = {
    contracts: PropTypes.array
  }

  static defaultProps = {
    noTitle: false,
    contracts: []
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

    return [
      {
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
        }
      },
      {
        title: 'Contract Address',
        dataIndex: 'address',
        align: 'center',
        render: (address) => {
          let f = address;
          let lf = f.substring(0, 6);
          let hf = f.substring(36, 43)
          let truncFrom = lf + " .. " + hf;
          return (
            <Tooltip placement="top" title={address}>
              <Link to={`/address/${address}`}>
                {truncFrom}
              </Link>
            </Tooltip>
          );
        },
      },
      {
        title: 'Contract Name',
        dataIndex: 'type',
        align: 'center',
        render: (type) => {
          return (
            <b>{type}</b>
          )
        }
      },
      {
        title: 'Compiler Version',
        dataIndex: 'source',
        align: 'center',
        render: (source) => {
          return (
            <b>{source.compilerVersion}</b>
          )
        }
      },
      {
        title: 'Created By',
        dataIndex: 'from',
        align: 'center',
        render: (from) => {
          let f = from;
          let lf = f.substring(0, 6);
          let hf = f.substring(36, 43)
          let truncFrom = lf + " .. " + hf;
          return (
            <Tooltip placement="top" title={from}>
              <Link to={`/address/${from}`}>
                {truncFrom}
              </Link>
            </Tooltip>
          );
        },
      },
      {
        title: 'Timestamp',
        dataIndex: 'timestamp',
        align: 'center',
        width: 100,
        render: (text) => {
          return moment(text*1000).format('HH:mm DD/MM/YYYY')
        },
      },
      {
        title: 'Transaction Hash',
        dataIndex: 'txHash',
        align: 'center',
        render: (txHash) => {
          let h = txHash;
          let lh = h.substring(0, 10);
          let hh = h.substring(57, 67)
          let truncHash = lh + " .. " + hh;
          return (
            <Tooltip placement="top" title={txHash}>
              <Link to={`/transaction/${txHash}`}>
                {truncHash}
              </Link>
            </Tooltip>
          );
        },
      }
    ];
  } //getColumns


  render() {
    const { style, contracts, emptyText, noTitle } = this.props;
    return (
      <div style={style}>
        {
          contracts.length
            ? <div className='table-noBreak'>
              <Table
                rowKey="block"
                //columns={columns}
                columns={this.getColumns()}
                dataSource={contracts}
                scroll={{x: true}}
                size={isMobile ? 'small' : 'default'}
                onChange={(pagination, filters, sorter) => {
                  this.setState({
                    sorter: {
                      field: sorter.field,
                      order: sorter.order
                    }
                  })
                }}
              />
            </div>
            : <span style={styles.emptyText}>{emptyText}</span>
        }
      </div>
    )

  } //render


} //extends component

const styles = {
  tableWrapper: {
    height: '100%'
  },
  emptyText: {
    textAlign: 'center'
  }
}

export default VerifiedContractsTable;
