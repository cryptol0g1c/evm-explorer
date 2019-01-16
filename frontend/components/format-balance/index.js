import web3 from 'web3';
import BigNumber from 'bignumber.js';

const FormatBalance = ({v}) => {

  let ethBalance = value || '0';
  let bnBalance = new BigNumber(web3.utils.fromWei(ethBalance, 'ether'));
        
  return bnBalance.toFormat(bnBalance.decimalPlaces());

}


export default FormatBalance;