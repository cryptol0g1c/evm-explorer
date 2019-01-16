import React, { Component } from 'react';
import PropTypes from 'prop-types';
import AddressDetails from './address-details';
import ContractDetails from './contract-details';
import { Async, Nav } from '../../components';
import { connect } from 'react-redux';
import { get as getAddressData } from '../../services';
import { get } from 'lodash';
import web3 from 'web3';
import BigNumber from 'bignumber.js';

class Address extends Component {
  static propTypes = {
    data: PropTypes.object
  }

  static defaultProps = {
    data: {}
  }

  componentDidMount = () => {
    getAddressData(`/api/address/${get(this.props, 'match.params.address')}`, this.props.dispatch);
  }

  componentDidUpdate = (prevProps) => {
    if (this.props.history.location.pathname !== prevProps.location.pathname){
      getAddressData(`/api/address/${get(this.props, 'match.params.address')}`, this.props.dispatch);
    }
  }

  render() {
    const { data = {} } = this.props.data;
    let addrType = data.isContract ? "Contract" : "Externally Owned Account";
    let info = [];


    let ethBalance = data.balance || '0';
    let bnBalance = new BigNumber(web3.utils.fromWei(ethBalance, 'ether'));
    
    info = [
        "Address: "+data.address,
        "Balance: "+bnBalance.toFormat(bnBalance.decimalPlaces())+ " ETH",
        "Type: "+addrType
    ]

    return (
      <div>
        <Nav contract={data.isContract} location={this.props.location.pathname}/>

        <Async {...this.props}>
          <div>
            {
              data.isContract
                ? <ContractDetails {...this.props} />
                : <AddressDetails {...this.props} />
            }
          </div>
        </Async>
      </div>
    );
  }
}

const styles = {
  listMargin: {
    margin: '20px 0'
  }
};

const mapDispatchToProps = ({ loading }) => loading;

export default connect(mapDispatchToProps)(Address);
