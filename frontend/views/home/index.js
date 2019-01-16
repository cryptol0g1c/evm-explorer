import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { TransactionsTable, Nav, VerifiedContractsTable } from '../../components';
import io from 'socket.io-client';
import { Table, Tabs } from 'antd';
import numeral from 'numeral';

const TabPane = Tabs.TabPane;

const isMobile = window.innerWidth < 768;

const columns = [{
  title: 'Block Height',
  dataIndex: 'number',
  align: 'center',
  width: 100,
  render: (block) => {
    return <Link to={`/block/${block}`}>
      {numeral(block).format('0,0')}
    </Link>;
  },
}, {
  title: 'Miner/Authority',
  dataIndex: 'miner',
  align: 'center',
  width: 100,
  render: (text) => {
    return <Link to={`/address/${text}`}>
      {text}
    </Link>;
  },
}, {
  title: 'Timestamp',
  dataIndex: 'timestamp',
  align: 'center',
  width: 100,
  render: (text) => {
    return moment(text*1000).format('HH:mm DD/MM/YYYY')
  },
},
{
  title: 'TXs',
  dataIndex: 'tx',
  align: 'center',
  width: 100
},
{
  title: 'Uncles',
  dataIndex: 'uncles',
  align: 'center',
  width: 100
}];

class Home extends Component {
  constructor(props) {
    super(props);
  }

  state = {
    blocks: [],
    transactions: [],
    verifiedContracts: [],
    loading: true
  }

  ws = null;

  componentDidMount = () => {
    let blocks = fetch('/api/blocks')
      .then(function (response) {
        return response.json();
      })
      .then(({ success, data: { blocks, maxBlocks, transactions } }) => {
        if (success) {
          this.setState({
            blocks,
            maxBlocks,
            transactions,
            loading: false
          });
        }
      })
      .catch(error => console.log(error));


      let verifiedContracts = fetch('/api/contract/verified-contracts')
      .then(function (response) {
        return response.json();
      })
      .then((verifiedContracts) => {
        if (verifiedContracts.success) {
          this.setState({
            verifiedContracts: verifiedContracts.contracts
          });
        }
      })
      .catch(error => console.log(error));


    this.socket = io('https://explorer.bitsign.io');

    this.socket.on('new_block', (data) => {
      const { blocks, transactions } = this.state;

      data = JSON.parse(data);

      blocks.pop();

      this.setState({
        blocks: [data.block, ...blocks],
        transactions: [...data.transactions, ...transactions]
      });
    });
  }

  componentWillUnmount = () => {
    this.socket.close();
  }

  render() {
    const { blocks, maxBlocks, transactions, verifiedContracts } = this.state;

    return (
      <div>
        <Nav location={this.props.location.pathname}/>

        <Table rowKey='number'
          loading={this.state.loading}
          columns={columns}
          style={styles.listMargin}
          bordered
          dataSource={blocks}
          scroll={{x: true}}
          size={isMobile ? 'small' : 'default'}
        />

        <Tabs defaultActiveKey='1' className={styles.listMargin}>
          <TabPane tab='Latest Transactions' key='1'>
            <TransactionsTable
              bordered
              transactions={transactions}
              emptyText={`There aren\'t any transactions in the last ${maxBlocks} blocks`}
            />
          </TabPane>
          <TabPane tab='Latest Verified Contracts' key='2'>
            <VerifiedContractsTable
              bordered
              contracts={verifiedContracts}
              emptyText={`No verified contracts found`}
            />
          </TabPane>
        </Tabs>

      </div>
    );
  }
}

const styles = {
  listMargin: {
    margin: '20px 0'
  }
};

export default Home;
