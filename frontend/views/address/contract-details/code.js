import { Button } from 'antd';
import { atomOneDark } from 'react-syntax-highlighter/styles/hljs';
import { get } from 'lodash';
import React, { PureComponent } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/prism';

const isMobile = window.innerWidth < 768;

class Code extends PureComponent {

  state = {
    textToCopy: ''
  }

  handleCopyText = textToCopy => {
    this.setState({ textToCopy }, () => {
      const el = document.getElementById('clipboard');
      el.select();
      document.execCommand('copy');
    });
  }

  renderCopyToClipboardButton = text => {
    return (
      <Button color='link' style={styles.copyToClipboardButton} onClick={() => this.handleCopyText(text)}>
        <i className='fa fa-clipboard' aria-hidden='true' />
        <span style={styles.copyToClipboardButtonText}>Copy to clipboard</span>
      </Button>
    );
  }

  render() {
    const { contract } = this.props;

    const abi = get(contract, 'abi', null);
    const bytecode = get(contract, 'bytecode', null);
    const sourceCode = get(contract, 'source.code', null);

    return (
      <div>
        <ul style={styles.list}>
          <li style={styles.listItem}>
            <span>Compiler version: </span>
            <span style={styles.listValue}>{contract.source.compilerVersion}</span>
          </li>

          <li style={styles.listItem}>
            <span>Optimization enabled: </span>
            <span style={styles.listValue}>{contract.source.optimizerEnabled ? 'Yes' : 'No'}</span>
          </li>
        </ul>

        {
          sourceCode &&
          <div style={styles.content}>
            <div style={styles.headerWrapper}>
              <p style={styles.title}>Contract source code</p>
              {this.renderCopyToClipboardButton(sourceCode)}
            </div>

            <SyntaxHighlighter
              wrapLines
              showLineNumbers
              style={atomOneDark}>
              {sourceCode}
            </SyntaxHighlighter>
          </div>
        }

        {
          abi &&
          <div style={styles.content}>
            <div style={styles.headerWrapper}>
              <p style={styles.title}>Contract ABI</p>
              {this.renderCopyToClipboardButton(JSON.stringify(abi))}
            </div>

            <SyntaxHighlighter
              style={atomOneDark}>
              {JSON.stringify(abi)}
            </SyntaxHighlighter>
          </div>
        }

        {
          bytecode &&
          <div style={styles.content}>
            <div style={styles.headerWrapper}>
              <p style={styles.title}>Contract bytecode</p>
              {this.renderCopyToClipboardButton(bytecode)}
            </div>

            <SyntaxHighlighter
              style={atomOneDark}>
              {bytecode}
            </SyntaxHighlighter>
          </div>
        }

        <textarea
          id='clipboard'
          style={styles.clipboardWrapper}
          value={this.state.textToCopy} 
          readOnly />
      </div>
    );
  }
}

const styles = {
  content: {
    marginTop: '2rem'
  },
  headerWrapper: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between'
  },
  title: {
    marginBottom: 0
  },
  listValue: {
    float: 'right',
    display: 'inline-block',
    width: '50%'
  },
  listItem: {
    marginBottom: '0.5rem'
  },
  list: {
    width: isMobile ? '100%' : '50%'
  },
  copyToClipboardButton: {
    color: 'black',
    marginBottom: '0.5rem'
  },
  copyToClipboardButtonText: {
    paddingLeft: '0.75rem'
  },
  clipboardWrapper: {
    position: 'absolute',
    left: '-9999px'
  }
};

export default Code;
