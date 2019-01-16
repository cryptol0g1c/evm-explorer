import './header.scss'

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { isEmpty } from 'lodash';
import Web3 from 'web3';
import { Menu, Dropdown, Button, Icon, Input, Layout } from 'antd';

const { Header } = Layout;

const Search = Input.Search;

const menu = (
  <Menu>
    <Menu.Item key="1">
      <Link to='/verify-contract'>
        Verify contract
      </Link>
    </Menu.Item>
  </Menu>
);


export default class HeaderComponent extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false,
      query: ''
    };
  }

  static contextTypes = {
    router: PropTypes.object
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  handleSubmit = () => {
    const { query } = this.state;
    let isAddress;
    let isTx;
    let isBlock;

    if (isEmpty(this.state.query)) {
      return;
    }

    try {
      const formattedAddress = Web3.utils.toChecksumAddress(query);
      isAddress = Web3.utils.isAddress(query);
    } catch (error) { }

    isTx = query.length == 66;
    isBlock = Number.isInteger(Number(query));

    // TODO: Finish this validation
    if (isAddress) {
      this.context.router.history.push(`/address/${query}`);
    } else if (isTx) {
      this.context.router.history.push(`/transaction/${query}`);
    } else if (isBlock) {
      this.context.router.history.push(`/block/${query}`);
    }
  }

  handleInputChange = event => {
    this.setState({
      query: event.target.value
    });
  }

  render() {
    return (
      <Header style={styles.header}>

        <Link to='/'>
          <img className='brandLogo' src={require('../../assets/bitsign-logo.png')} />
        </Link>

        <div style={styles.div}>

          <Search
            placeholder="Search by Transaction Hash / Block Number / Address"
            value={this.state.query}
            onChange={this.handleInputChange}
            onSearch={() => this.handleSubmit()}
            className='searchInput'
            size={'large'}
          />

          <Dropdown overlay={menu}>
            <Button size={'large'} style={styles.button}>
              Tools <Icon type="down" />
            </Button>
          </Dropdown>

        </div>

      </Header>
    );
  }
}

const styles = {
  searchInput: {
    minWidth: 600,
    marginRight: 30,
    height: '40px'
  },
  button: {
    marginLeft: 8,
    display: 'flex',
    alignItems: 'center'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-around',
    height: '75px',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    borderBottom: '1px solid #ddd',
    //boxShadow: '0px -8px 8px 10px rgba(0, 0, 0, 0.25)'
  },
  div: {
    display: 'flex',
    flexDirection: 'row'
  }
};
