import React from 'react';
import PropTypes from 'prop-types';
import { Layout } from 'antd';

const { Content } = Layout;

const isMobile = window.innerWidth < 768;

const Body = ({ children }) => <Content style={styles.container}>
  {children}
</Content>

const styles = {
  container: {
    paddingBottom: '2rem',
    paddingTop: '2rem',
    width: isMobile ? '90%' : '70%',
    minHeight: '100%',
    alignSelf: 'center'
  }
}

Body.propTypes = {
  children: PropTypes.node
}

export default Body;
