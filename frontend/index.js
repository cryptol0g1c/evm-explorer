import './_index.scss';
import 'antd/dist/antd.css';

import 'babel-core/register';
import 'babel-polyfill';

import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './redux';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import { Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import {
  Address,
  Block,
  Home,
  Transaction,
  VerifyContract
} from './views';
import {
  Body,
  Header,
  Footer
} from './components';
import { Layout } from 'antd';

if (process.env.NODE_ENV !== 'production') {
  let script = document.createElement('script');

  script.setAttribute('src', 'http://localhost:35729/livereload.js');

  document.body.appendChild(script);
}

const options = {
  position: 'top center',
  timeout: 5000,
  offset: '30px',
  transition: 'scale'
};


const App = () => (
  <BrowserRouter>
    <Provider store={store}>
      <AlertProvider template={AlertTemplate} {...options}>
        <Layout style={{backgroundColor: '#fff', minHeight: '100%', margin: 0}}>
          <Header />
          <Body >
            <Switch>
              <Route exact path='/' component={Home} />
              <Route path='/block/:number' component={Block} />
              <Route path='/address/:address' component={Address} />
              <Route path='/transaction/:hash' component={Transaction} />
              <Route path='/tx/:hash' component={Transaction} />
              <Route path='/verify-contract' component={VerifyContract} />
            </Switch>
          </Body>
          <Footer />
        </Layout>
      </AlertProvider>
    </Provider>
  </BrowserRouter>
);

render((
  <BrowserRouter>
    <App />
  </BrowserRouter>
), document.getElementById('root'));
