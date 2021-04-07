import React from 'react';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import getCampaign from '../ethereum/campaign';
import web3 from '../ethereum/web3';


class ContributeForm extends React.Component {
  state = {
    value: '',
    waiting: false,
    errMessage: '',
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const campaign = getCampaign(this.props.address);

    try {
      this.setState({ waiting: true });
      const accounts = await web3.eth.getAccounts();
      await campaign.methods.contribute().send({ from: accounts[0], value: web3.utils.toWei(this.state.value, 'ether')});
      this.props.router.replace(`/campaigns/${this.props.address}`);
    } catch(err) {
      this.setState({ errMessage: err.message });
    } finally {
      this.setState({ waiting: false, valu: '' });
    }
  }
  
  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errMessage}>
        <Form.Field>
          <label>amount to contribute</label>
          <Input label="ether" labelPosition="right" onChange={(e) => this.setState({ value: e.target.value })}/>
        </Form.Field>
        <Message error header="Oops!" content={this.state.errMessage} />
        <Button primary loading={this.state.waiting}>contribute!</Button>
      </Form>
    );
  }
}

export default withRouter(ContributeForm);