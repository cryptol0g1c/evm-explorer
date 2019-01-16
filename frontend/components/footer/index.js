import './footer.scss';

import React from 'react';
import { Icon } from 'antd';

const styles = {
  margins: {
    marginLeft: '10px',
    marginRight: '10px'
  }
}

const Footer = () => {
  return (
    <div className='footerStyle'>
      <div style={styles.margins}>
        <b>Copyright Reserved © 2018 Cryptologic</b> | The contents of this page are licensed BSD-3-Clause. 
        <Icon type="github" style={{marginLeft: '1rem'}}/> v0.0.9
      </div>
    </div>
  )
}

export default Footer;