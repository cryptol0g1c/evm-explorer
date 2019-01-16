import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'antd';
import { Link } from 'react-router-dom';

const isMobile = window.innerWidth < 768;

const columns = [{
  title: 'Block',
  dataIndex: 'block',
  render: (text) => {
    return <Link to={`/block/${text}`}>
      {text}
    </Link>;
  },
},
{
  title: 'Date',
  dataIndex: 'date',
},
{
  title: 'TXs',
  dataIndex: 'txs',
},
{
  title: 'Gas used',
  dataIndex: 'gasUsed',
}];

const MinedBlocksTable = ({ style, minedBlocks, emptyText, noTitle }) => <div style={style}>
  {!noTitle && <h4>Mined Blocks</h4>}

  {
    minedBlocks.length
      ? <div>
          <Table 
            rowKey="block" 
            columns={columns} 
            dataSource={minedBlocks}
            scroll={{x: true}}
            size={isMobile ? 'small' : 'default'}/>
        </div>
      : <span style={styles.emptyText}>{emptyText}</span>
  }
</div>;

MinedBlocksTable.propTypes = {
  minedBlocks: PropTypes.array
}

MinedBlocksTable.defaultProps = {
  noTitle: false,
  minedBlocks: []
}

const styles = {
  tableWrapper: {
    height: '100%'
  },
  emptyText: {
    textAlign: 'center'
  }
}

export default MinedBlocksTable;
