import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get, uniq } from 'lodash';

const EventsTable = ({ style, events, noTitle, emptyText }) => {
  const eventsNames = uniq(events.map(({ event }) => event));

  return (
    <div style={style}>
      {!noTitle && <h2>Events</h2>}

      {
        events.length
          ? eventsNames.map((eventName, index) => <div key={`eventType-${index}`}>
            <h4 style={styles.title}>{eventName}</h4>

            <ul>
              {
                events.filter(({ event }) => event === eventName).map((e, index) =>
                  <li key={`event-${index}`}>

                    <ul>
                      <li>
                        <b>Block Number: </b>

                        <Link to={`/block/${e.blockNumber}`}>
                          {e.blockNumber}
                        </Link>
                      </li>

                      <li>
                        <b>Return Values:</b>

                        <ul style={styles.returnValuesList}>
                          {
                            Object.keys(e.returnValues).map((key, index) => <li key={`returnValue-${index}`}>
                              <b>{key}:</b> <span>{e.returnValues[key]}</span>
                            </li>)
                          }
                        </ul>
                      </li>
                    </ul>

                  </li>
                )
              }
            </ul>
          </div>)
          : <span style={styles.emptyText}>{emptyText}</span>
      }
    </div>
  );
}

EventsTable.propTypes = {
  events: PropTypes.array
}

EventsTable.defaultProps = {
  noTitle: false,
  events: []
}

const styles = {
  infoButton: {
    backgroundColor: 'transparent',
    border: 0,
    cursor: 'pointer'
  },
  tableWrapper: {
    height: '100%'
  },
  emptyText: {
    textAlign: 'center'
  },
  returnValuesList: {
    marginLeft: '1rem'
  },
  title: {
    margin: '8px 0'
  }
}

export default EventsTable;
