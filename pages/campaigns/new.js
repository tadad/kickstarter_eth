import React from 'react';
import { Input, Form, Button, Message } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import Layout from '../../components/Layout';
import factory from '../../ethereum/factory';
import web3 from '../../ethereum/web3';

class New extends React.Component {
  state = {
    minContribution: '',
    errMessage: '',
    waiting: false,
  }

  onSubmit = async (e) => {
    e.preventDefault();
    this.setState({ errMessage: '' });
    try {
      this.setState({ waiting: true });
      const accounts = await web3.eth.getAccounts();
      await factory.methods
        .createCampaign(this.state.minContribution)
        .send({
          from: accounts[0],
        });
      this.props.router.push('/');
    } catch (err) {
      this.setState({ errMessage: err.message});
    } finally {
      this.setState({ waiting: false });
    }
  }

  render() {
    return (
      <Layout>
        <h1>create a campaign</h1>
        <Form onSubmit={this.onSubmit} error={!!this.state.errMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input 
              label="Wei"
              labelPosition="right"
              value={this.state.minContribution}
              onChange={(e) => {this.setState({ minContribution: e.target.value })}}
            />
          </Form.Field>
          <Message error header="Oops!" content={this.state.errMessage} />
          <Button primary loading={this.state.waiting}>create!</Button>
        </Form>
      </Layout>
    )
  }
}

export default withRouter(New);