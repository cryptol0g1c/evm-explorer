import React from 'react'
import PropTypes from 'prop-types';
import { Spin } from 'antd';

const Async = ({ children, isFetching, error }) => {
  
  if (error) {
    return (
      <div>
        {error}
      </div>
    );
  }

  return  <Spin spinning={isFetching} size="large">
            {children}
          </Spin>
}

Async.propTypes = {
  children: PropTypes.node,
  isFetching: PropTypes.bool,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ])
};

Async.defaultProps = {
  loadingText: 'Loading'
};

export default Async;
