import React from 'react';
import PropTypes from 'prop-types';
import { Timeline } from 'antd';

const TimelineTable = ({ style, transactions, emptyText, noTitle }) => {
  transactions.reverse();
  return (
    <div>

    <Timeline>
      {
        (transactions.length > 0) ?
            transactions.map(item =>
            <Timeline.Item>
                <b>Block Number: </b>{item.block}
                <p>From: {item.from}</p>
                <p>Hash: {item.hash}</p>
            </Timeline.Item>) :
            <Timeline.Item>No Events found</Timeline.Item>
      }
    </Timeline>
    </div >
  )
}

TimelineTable.propTypes = {
  transactions: PropTypes.array
}

TimelineTable.defaultProps = {
  noTitle: false,
  transactions: []
}

export default TimelineTable;
