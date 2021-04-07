import React from 'react';
import Layout from '../../../components/Layout';
import { Form, Input, Message, Button } from 'semantic-ui-react';
import { withRouter } from 'next/router';
import getCampaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';


class NewRequest extends React.Component {
  state = {
    value: '',
    description: '',
    recipient: '',
    waiting: false,
    errMessage: '',
  }

  static async getInitialProps(props) {
    const {address} = props.query;

    return {address};
  }

  onSubmit = async (e) => {
    e.preventDefault();
    const { description, recipient, value } = this.state;
    const campaign = getCampaign(this.props.address);
    this.setState({ waiting: true });

    try {
      const accounts = await web3.eth.getAccounts();
      await campaign.methods
        .createRequest(description, web3.utils.toWei(value, 'ether'), recipient)
        .send({ from: accounts[0] });
      this.props.router.replace(`/campaigns/${this.props.address}/requests`);
    } catch(err) {
      this.setState({ errMessage: err.message });
    } finally {
      this.setState({ waiting: false, value: '' });
    }
  }
  
  render() {
    return (
      <Layout>
        <h3>Submit a Request</h3>
        <Form onSubmit={this.onSubmit} error={!!this.state.errMessage}>
          <Form.Field>
            <label>Description</label>
            <Input value={this.state.description} onChange={(e) => this.setState({ description: e.target.value })}/>
          </Form.Field>
          <Form.Field>
            <label>value</label>
            <Input 
              label="Ether"
              labelPosition="right"
              value={this.state.value}
              onChange={(e) => this.setState({ value: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>recipient</label>
            <Input value={this.state.recipient} onChange={(e) => this.setState({ recipient: e.target.value })}/>
          </Form.Field>
          <Message error header="Oops!" content={this.state.errMessage} />
          <Button primary loading={this.state.waiting}>submit a request</Button>
        </Form>
      </Layout>
    );
  }
}

export default withRouter(NewRequest);