import React from 'react';
import Link from 'next/link';
import { Card, Button } from 'semantic-ui-react';
import Layout from '../components/Layout';
import factory from '../ethereum/factory';

class Index extends React.Component {
  static async getInitialProps() {
    const campaigns = await factory.methods.getDeployedCampaigns().call();
    return { campaigns };
  }

  renderCampaigns = () => {
    const items = this.props.campaigns.map((address, i) => {
      return {
        header: address,
        description: <Link href={`/campaigns/${address}`}>view campaign </Link>,
        fluid: true
      }
    });

    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Open Campaigns</h3>
        <Link href="/campaigns/new">
          <Button
            content="Create Campaign"
            floated="right"
            icon="add"
            primary
          />
        </Link>
        {this.renderCampaigns()}
      </Layout>
    );
  }
}

export default Index;