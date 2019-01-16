import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Async, TransactionsTable, Nav } from '../../components';
import { connect } from 'react-redux';
import { get as getBlockData } from '../../services';
import { get, startCase } from 'lodash';
import { Link } from 'react-router-dom';
import { List, Tabs } from 'antd';
import moment from 'moment';
import numeral from 'numeral';

const TabPane = Tabs.TabPane;

const isMobile = window.innerWidth < 768;

class Block extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  static defaultProps = {
    data: {}
  }

  componentDidMount = () => {
    getBlockData(`/api/block/${get(this.props, 'match.params.number')}`, this.props.dispatch);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.history.location.pathname !== prevProps.location.pathname){
      getBlockData(`/api/block/${get(this.props, 'match.params.number')}`, this.props.dispatch);
    }
  }

  renderValue = key => {
    const { blockDetails = {} } = this.props.data;
    const value = blockDetails[key];

    if (key === 'author' || key === 'miner') {
      return (
        <Link to={`/address/${value}`}>
          {value}
        </Link>
      );
    }else if(key === 'size'){
      return(
        value+' Bytes'
      )
    }else if(key === 'timestamp'){
      return(
        moment(value*1000).format()
      )
    }

    return value
  }

  render() {
    const { blockDetails = {}, transactions = [] } = this.props.data;
    const data = [];

    Object.keys(blockDetails).forEach(key => {
      return data.push(key)
    })

    return (
      <div>
        <Nav location={this.props.location.pathname}/>

        <Async {...this.props}>
          <div>

            <List
              header={<h4>Block Height {numeral(blockDetails.number).format('0,0')}</h4>}
              size={isMobile ? 'small' : 'medium'}
              bordered
              dataSource={data}
              style={styles.listMargin}
              renderItem={item => (<List.Item><b>{startCase(item)}</b>: 
                <div style={styles.divItem}> {this.renderValue(item)}</div></List.Item>)}
            />

            <Tabs defaultActiveKey="1" className={styles.listMargin}>
              <TabPane tab="Mined Transactions" key="1">
                <TransactionsTable 
                  style={styles.transactionTable} 
                  transactions={transactions} 
                  emptyText={'There aren\'t any transactions in this block'} 
                />
              </TabPane>
            </Tabs>
            
          </div>
        </Async>
      </div>
    );
  }
}

const styles = {
  listTitle: {
    fontWeight: 'bold',
    marginRight: 10
  },
  listMargin: {
    margin: '20px 0'
  },
  transactionTable: {
    marginTop: 20
  },
  divItem: {
    wordBreak: 'break-all',
    marginLeft: '4px'
  }
};

const mapDispatchToProps = ({ loading }) => loading;

export default connect(mapDispatchToProps)(Block);
