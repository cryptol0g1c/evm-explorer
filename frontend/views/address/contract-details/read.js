import './_write.scss';

import React, { Component } from 'react';
import EthForm from 'react-eth';
import { differenceBy } from 'lodash';
import { post } from '../../../services';
import { List, message } from 'antd';

const isMobile = window.innerWidth < 768;

class Read extends Component {

  constructor(props) {
    super(props);

    this.state = {
      responses: {}
    };
  }

  getValue = value => {
    if (typeof value === 'boolean') {
      return value ? 'true' : 'false'
    }
    return value;
  }

  getReadableFunctions = (abi, readValues) => {
    return differenceBy(abi.filter(f => f.constant && f.type === 'function'), readValues, 'name');
  }

  handleSubmit = async (method, formData, address) => {
    const response = await post(`/api/address/${address}/${method}`, {
      params: Object.values(formData)
    });

    if (response.success) {
      this.setState({
        responses: Object.assign({}, this.state.responses, {
          [method]: response.data.outputs
        })
      })
    } else {
      message.error(response.error);
    }
  }

  render() {
    const { contract, readValues } = this.props;

    return (
      <div className='read'>
        <ul className='ant-list ant-list-lg ant-list-split ant-list-bordered'>
          <List
            size={isMobile ? 'small' : 'medium'}
            itemLayout='vertical'>
            {
              readValues.map(({ name, outputs }, index) =>
                <List.Item key={`abiItem-${index}`}>
                  <b>
                    {name}
                  </b>

                  <div style={styles.outputs}>
                    {
                      outputs.map(({ value, type }, index) =>
                        <li
                          style={styles.value}
                          key={`output-${index}`}>
                          {this.getValue(value)} <span style={styles.outputType}>{type}</span>
                        </li>
                      )
                    }
                  </div>
                </List.Item>
              )
            }
          </List>

          {
            this.getReadableFunctions(contract.abi, readValues).map((func, index) =>
              <li key={`readable-${index}`}>
                <EthForm
                  abi={func}
                  onSubmit={({ formData }) => this.handleSubmit(func.name, formData, contract.address)}
                />

                {
                  this.state.responses[func.name] &&
                  <ul>
                    {
                      this.state.responses[func.name].map(({ value, type }, index) =>
                        <li key={`response-${index}`}>
                          {this.getValue(value)} <span style={styles.outputType}>{type}</span>
                        </li>
                      )
                    }
                  </ul>


                }
              </li>
            )
          }
        </ul>
      </div>
    );
  }
}

const styles = {
  value: {
    margin: 0
  },
  outputs: {

  },
  outputType: {
    color: 'gray',
    fontStyle: 'italic',
    fontSize: 14
  }
};

export default Read;
