import React, { Component } from 'react';
import { MinedBlocksTable, TransactionsTable} from '../../components';
import { Icon, Tabs, List, Popover, Timeline } from 'antd';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import web3 from 'web3';
import BigNumber from 'bignumber.js';

const TabPane = Tabs.TabPane;

const content = (
  <div>
    <b>Copied to Clipboard!</b>
  </div>
);

export default class AddressDetails extends Component {
  constructor(props) {
    super(props);

    this.state = {
      currentPanel: 'transactions'
    };
  }

  handleButtonGroupClick = panel => this.setState({ currentPanel: panel })

  renderKey = key => {
    if(key == "address" || key == "balance")
      return (<b>{key.charAt(0).toUpperCase()+key.slice(1)}</b>);
    else if(key == "isContract")
      return (<b>Type</b>);
  }

  renderValue = key => {
    const { data = {} } = this.props.data;

    const value = data[key];

    if(key ==  "address")
      return (<CopyToClipboard text={value}>
      <span>
        {value}
        <Popover content={content} trigger="click">
            <Icon style={styles.copy}
              type="copy"
              theme="twoTone"
              twoToneColor="#7fa4e0"/>
          </Popover>
      </span>
      </CopyToClipboard>)
    else if(key == "balance"){
      
      let ethBalance = value || '0';
      let bnBalance = new BigNumber(web3.utils.fromWei(ethBalance, 'ether'));
        
      return (bnBalance.toFormat(bnBalance.decimalPlaces())+ " ETH");
      
    }else if(key == "isContract"){
      return( value ? "Contract" : "Externally Owned Account");
    }
  }

  render() {
    let {
      transactions = {},
      transactionsQty
    } = this.props.data;
    const { currentPanel } = this.state;

    const { data = {} } = this.props.data;

    delete data.isVerified;

    let parsedData = [];

    Object.keys(data).forEach(key => {
      return parsedData.push(key);
    })
    
    return (
      <div>
        <List
        header={<span><b>Address Information</b></span>}
        size="small"
        bordered
        dataSource={parsedData}
        style={styles.listMargin}
        renderItem={item =>
          (<List.Item>
            {this.renderKey(item)}: <div style={styles.divItem}> {this.renderValue(item)}</div>
          </List.Item>)
        }
        />
        <div>
          <Tabs defaultActiveKey="1" className={styles.listMargin}>
            <TabPane tab="Transactions" key="1">
              <TransactionsTable
                address={data.address}
                noTitle={true}
                transactions={transactions.transactions}
                emptyText={`There aren't any transactions in the last ${transactionsQty} blocks`}
              />
            </TabPane>

            <TabPane tab="Mined Blocks" key="2">
            <MinedBlocksTable
                noTitle={true}
                minedBlocks={transactions.minedBlocks}
                emptyText={`This address didn't mine any block.`}
              />
            </TabPane>

            <TabPane  tab="Timeline" key="3">

              <Timeline>
                {/* <Timeline.Item>Create a services site 2015-09-01</Timeline.Item>
                <Timeline.Item>Solve initial network problems 2015-09-01</Timeline.Item>
                <Timeline.Item>Technical testing 2015-09-01</Timeline.Item>
                <Timeline.Item>Network problems being solved 2015-09-01</Timeline.Item> */}
              </Timeline>
            </TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

const styles = {
  contractData: {
    marginBottom: '2rem'
  },
  listMargin: {
    margin: '20px 0'
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
    marginBottom: '0.5rem'
  },
  detailsButton: {
    borderRadius: 0,
    textTransform: 'capitalize'
  },
  panel: {
    border: '1px solid lightgray'
  },
  contractDataList: {
    width: '50%'
  },
  contractDataListWrapper: {
    display: 'flex'
  },
  copy: {
    cursor: 'copy',
    marginLeft: '4px'
  },
  divItem: {
    wordBreak: 'break-all',
    marginLeft: '4px'
  }
};
