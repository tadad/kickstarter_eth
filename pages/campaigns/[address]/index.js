import React from 'react';
import Link from 'next/link';
import { Card, Grid } from 'semantic-ui-react';
import Layout from '../../../components/Layout';
import ContributeForm from '../../../components/ContributeForm';
import getCampaign from '../../../ethereum/campaign';
import web3 from '../../../ethereum/web3';

class Address extends React.Component {
  static async getInitialProps(props) {
    const campaign = getCampaign(props.query.address);

    const summary = await campaign.methods.getSummary().call();
    return {
      minContribution: summary['0'],
      balance: summary['1'],
      numRequests: summary['2'],
      approversCount: summary['3'],
      manager: summary['4'],
      address: props.query.address,
    };
  }

  renderCards = () => {
    const { minContribution, balance, numRequests, approversCount, manager } = this.props;

    const items = [
      {
        header: manager,
        meta: "Address of manager",
        description: "blah blah blah",
        style: {overflowWrap: 'break-word'},
      },
      {
        header: minContribution,
        meta: "Minimum Contribution (Wei)",
        description: "blah"
      },
      {
        header: numRequests,
        meta: "Number of requests",
        description: "Requests must be approved"
      },
      {
        header: approversCount,
        meta: "number of approvers",
        description: "blah"
      },
      {
        header: web3.utils.fromWei(balance, 'ether'),
        meta: "Campaign balance (ether)",
        description: "how much they have left to spend"
      },
    ]

    return <Card.Group items={items} />
  }

  render() {
    return (
      <Layout>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}

            </Grid.Column>
            <Grid.Column width={6}>
              <ContributeForm address={this.props.address}/>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
              <Link href={`/campaigns/${this.props.address}/requests`}>
                view all requests
              </Link>
            </Grid.Column>
          </Grid.Row>
        </Grid> 
      </Layout>
    );
  }
}

export default Address;