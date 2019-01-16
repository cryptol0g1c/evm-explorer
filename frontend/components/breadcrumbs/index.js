import React from 'react';
import { Breadcrumb, Icon } from 'antd';
import { Link } from 'react-router-dom';

const breadcrumbNameMap = {
  '/': 'Home',
  '/block': 'Block',
  '/address': 'Address',
  '/transaction': 'Transaction',
  '/verify-contract': 'Verify Contract',
};

const BC = ({ location, contract = false }) => {
  const pathSnippets = location.split('/').filter(i => i);

  const extraBreadcrumbItems = pathSnippets.map((_, index) => {
    const url = `/${pathSnippets.slice(0, index + 1).join('/')}`;

    return (
      <Breadcrumb.Item key={url}>
        {
          (!!breadcrumbNameMap[url]) ?
                (!!contract && breadcrumbNameMap[url] === 'Address') ?
                  'Contract' :
                  breadcrumbNameMap[url]:
            _
        }
      </Breadcrumb.Item>
    );
  });

  const breadcrumbItems = [(
    <Breadcrumb.Item key="home">
      <Icon type="home" />
      <Link to="/"> Home</Link>
    </Breadcrumb.Item>
  )].concat(extraBreadcrumbItems);

  return (
    <div>
      <Breadcrumb>
        { breadcrumbItems }
      </Breadcrumb>
    </div>
  )
}

export default BC