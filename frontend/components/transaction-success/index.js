import React, { Component } from 'react';
import { startCase, pick, isEmpty } from 'lodash';
import { Link } from 'react-router-dom';

class TransactionSuccess extends Component {

  renderValue = (key, value) => {
    if (key === 'from' || key === 'to') {
      return (
        <Link to={`/address/${value}`}>
          {value}
        </Link>
      );
    } else if (key === 'blockNumber') {
      return (
        <Link to={`/block/${value}`}>
          {value}
        </Link>
      )
    } else if (key === 'transactionHash') {
      return (
        <Link to={`/transaction/${value}`}>
          {value}
        </Link>
      );
    }

    return value;
  }

  hasData = () => {
    return !isEmpty(this.props.data);
  }

  render() {
    return (
      this.hasData() && !this.props.loading
        ? <div style={styles.container}>
          <div style={styles.header}>
            <b>Transaction success details</b>

            <div
              className='fa fa-window-close'
              style={styles.closeButton}
              onClick={this.props.toggle} />
          </div>

          <ul>
            {
              Object.keys(
                pick(this.props.data, ['blockHash', 'transactionHash', 'blockNumber', 'transactionHash', 'gasUsed'])
              ).map((key, index) =>
                <li key={`item-${index}`}>
                  <span style={styles.listTitle}>
                    <b>{startCase(key)}:</b> {this.renderValue(key, this.props.data[key])}
                  </span>
                </li>
              )
            }
          </ul>
        </div>
        : null
    );
  }
}

const styles = {
  container: {
    marginBottom: '2rem'
  },
  closeButton: {
    cursor: 'pointer',
    outline: 'none'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between'
  }
}

export default TransactionSuccess;
