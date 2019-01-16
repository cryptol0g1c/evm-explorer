import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { get, post } from '../../services';
import { Form, Input, Select, Button, Checkbox, Spin, message } from 'antd';
import { isEmpty } from 'lodash';
import {
  fetchFailure
} from '../../redux/actions/loading';
import { parse } from 'querystring';
import Web3 from 'web3';
import { Nav } from '../../components';

const FormItem = Form.Item;
const InputGroup = Input.Group;
const Option = Select.Option;
const { TextArea } = Input;
const isMobile = window.innerWidth < 768;

class VerifyContract extends Component {

  static defaultProps = {
    data: {}
  }

  labels = {
    contractAddress: 'Contract Address',
    contractName: 'Contract Name',
    compilerVersion: 'Compiler Version',
    contractCode: 'Contract Code',
    contractDecodedParameters: 'Constructor Arguments ABI-encoded',
    optimizerEnabled: 'Optimizer Enabled'
  }

  required = {
    contractAddress: true,
    contractName: true,
    compilerVersion: true,
    contractCode: true,
    contractDecodedParameters: false,
    optimizerEnabled: false
  }

  static contextTypes = {
    router: PropTypes.object
  }

  constructor(props) {
    super(props);

    const { location: { search } } = props;

    this.state = {
      errors: {
        contractAddress: null,
        contractName: null,
        compilerVersion: null,
        contractCode: null,
        contractDecodedParameters: null
      },
      form: {
        contractAddress: parse(search.substring(1)).address || '',
        contractName: '',
        compilerVersion: '',
        contractCode: '',
        contractDecodedParameters: '',
        optimizerEnabled: true
      },
      versions: []
    }
  }

  componentDidMount = () => {
    get('/api/contract/versions/', this.props.dispatch);
  }

  componentDidUpdate = (prevProps) => {
    const { data: { versions } } = this.props;
    const { form } = this.state;

    if (isEmpty(prevProps.data.versions) && !isEmpty(versions)) {
      this.setState({
        form: Object.assign({}, form, {
          compilerVersion: versions[0].longVersion
        }),
        versions
      });
    }
  }

  verifyAndSubmit = () => {
    const { form } = this.state;
    let errors = {};

    Object.keys(form).map(key => {
      if (this.required[key] && isEmpty(form[key])) {
        errors[key] = `${this.labels[key]} is required.`
      };
    });

    if (!Web3.utils.isAddress(form.contractAddress)) {
      errors['contractAddress'] = 'Address format is not correct.'
    }

    if (!isEmpty(errors)) {
      this.setState({ errors });
      return;
    }

    post('/api/contract/verify', this.state.form, this.props.dispatch)
      .then(({ success, data, error }) => {
        if (success) {
          this.context.router.history.push(`/address/${data.contract.address}`);
        } else {
          message.alert(error.toString());
          this.props.dispatch(fetchFailure(error));
        }
      });
  }

  clearForm = () => {
    this.setState({
      form: {
        contractAddress: '',
        contractName: '',
        compilerVersion: this.state.versions[0].longVersion,
        contractCode: '',
        contractDecodedParameters: '',
        optimizerEnabled: true
      }
    });
  }

  onChange = event => {
    let { form } = this.state;
    let newForm = {};

    if (typeof event == 'string') {
      newForm = {
        compilerVersion: event
      };
    } else {
      const { value, name } = event.target;

      if (name === 'optimizerEnabled') {
        newForm = {
          optimizerEnabled: !this.state.form.optimizerEnabled
        };
      } else {
        newForm = {
          [name]: value
        };
      }
    }

    this.setState({ form: Object.assign({}, form, newForm) });
  }

  render() {
    const { errors, form, versions = [] } = this.state;
    const { error, isFetching } = this.props;

    if (isFetching) {
      return (
        <div style={styles.loadingContainer}>
          <Spin size='large'/>
        </div>
      );
    }

    return (
      <div>
        <Nav location={this.props.location.pathname}/>

        <Form onSubmit={e => e.preventDefault()}>
          <div style={styles.inline}>

            <FormItem style={styles.addressFormField}
              validateStatus={Boolean(errors.contractAddress) ? "error" : null}
              help={errors.contractAddress}
            >
              <label><b>{this.labels.contractAddress}</b></label>
              <Input
                type='text'
                name='contractAddress'
                id='contractAddress'
                value={form.contractAddress}
                onChange={this.onChange}
              />
            </FormItem>

            <FormItem style={styles.contractsFormField}
              validateStatus={Boolean(errors.contractName) ? "error" : null}
              help={errors.contractName}
            >
              <label><b>{this.labels.contractName}</b></label>
              <Input
                type='text'
                name='contractName'
                id='contractName'
                value={form.contractName}
                onChange={this.onChange}
              />
            </FormItem>

            <FormItem style={styles.contractsFormField}
              validateStatus={Boolean(errors.compilerVersion) ? "error" : null}
              help={errors.compilerVersion}
            >
              <label><b>{this.labels.compilerVersion}</b></label>
              <InputGroup compact>
                <Select
                  showSearch
                  placeholder="Select a version"
                  optionFilterProp="children"
                  name='compilerVersion'
                  id='compilerVersion'
                  value={form.compilerVersion}
                  onChange={e => this.onChange(e)} >
                  {versions.map(({ longVersion }, index) => <Option value={longVersion} key={`version-${index}`}>{longVersion}</Option>)}
                </Select>
              </InputGroup>
            </FormItem>

            <FormItem
              validateStatus={Boolean(errors.optimizerEnabled) ? "error" : null}
              help={errors.optimizerEnabled}>
              <Checkbox
                style={styles.checkbox}
                id='optimizerEnabled'
                name='optimizerEnabled'
                checked={form.optimizerEnabled}
                value={form.optimizerEnabled}
                onChange={this.onChange}>
                {this.labels.optimizerEnabled}
              </Checkbox>
            </FormItem>

          </div>

          <FormItem
            validateStatus={Boolean(errors.contractCode) ? "error" : null}
            help={errors.contractCode}
          >
            <label><b>{this.labels.contractCode}</b></label>
            <TextArea
              name='contractCode'
              id='contractCode'
              style={styles.contractCode}
              value={form.contractCode}
              onChange={this.onChange}
            />
          </FormItem>

          <FormItem
            validateStatus={Boolean(errors.contractDecodedParameters) ? "error" : null}
            help={errors.contractDecodedParameters}
          >
            <label><b>{this.labels.contractDecodedParameters}</b></label>
            <Input
              type='text'
              name='contractDecodedParameters'
              id='contractDecodedParameters'
              value={form.contractDecodedParameters}
              onChange={this.onChange}
            />
          </FormItem>

          <Button.Group size='large'>
            <Button onClick={this.verifyAndSubmit}>Verify and submit</Button>
            <Button type="danger" onClick={this.clearForm}>Clear form</Button>
          </Button.Group>
        </Form>
      </div>
    );
  }
}

const styles = {
  inline: {
    display: isMobile ? 'block' : 'flex',
    justifyContent: 'space-between'
  },
  addressFormField: {
    width: isMobile ? '100%' : '37%'
  },
  contractsFormField: {
    width: isMobile ? '100%' : '20%'
  },
  contractCode: {
    height: '20rem'
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: '10rem'
  },
  spinner: {
    margin: 'auto'
  },
  checkbox: {
    top: isMobile ? null : 38
  }
};

const mapDispatchToProps = ({ loading }) => loading;

export default connect(mapDispatchToProps)(VerifyContract);
