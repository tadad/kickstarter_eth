import React from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import RequestRow from '../../../components/RequestRow';
import getCampaign from '../../../ethereum/campaign';
import { Button, Header, Table } from 'semantic-ui-react';

class Requests extends React.Component {
  static async getInitialProps(props) {
    const { address } = props.query
    const campaign = getCampaign(address);
    const requestCount = await campaign.methods.getRequestsCount().call();
    const approversCount = await campaign.methods.approversCount().call();


    const requests = await Promise.all(
      Array(parseInt(requestCount)).fill().map((element, index) => {
        return campaign.methods.requests(index).call();
      }
    ));

    return { address, requests, approversCount, requestCount};
  }

  renderRows() {
    return this.props.requests.map((request, index) => {
      return <RequestRow
        key={index}
        id={index}
        request={request}
        address={this.props.address}
        approversCount={this.props.approversCount}
      />;
    })
  }

  render() {
    const { Header, Row, HeaderCell, Body } = Table;
    return (
      <Layout>
        <Link href={`/campaigns/${this.props.address}/`}>back</Link>
        <h3>Pending Requests</h3>
        <Table>
          <Header>
            <Row>
              <HeaderCell>id</HeaderCell>
              <HeaderCell>description</HeaderCell>
              <HeaderCell>amount</HeaderCell>
              <HeaderCell>recipient</HeaderCell>
              <HeaderCell>approval count</HeaderCell>
              <HeaderCell>approve</HeaderCell>
              <HeaderCell>finalize</HeaderCell>
            </Row>
          </Header>
          <Body>
            {this.renderRows()}
          </Body>

        </Table>
        <Link href={`/campaigns/${this.props.address}/newrequest`}><Button floated="right" style={{marginBottom: "right"}} primary>Add a Request</Button></Link>
        <div>Found {this.props.requestCount} requests</div>
      </Layout>
    );
  }
}

export default Requests;