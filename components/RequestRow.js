import React from 'react';
import getCampaign from '../ethereum/campaign';
import { Table, Button } from 'semantic-ui-react';
import web3 from '../ethereum/web3';

class RequestRow extends React.Component {

  onApprove = async () => {
    const campaign = getCampaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.approveRequest(this.props.id).send({ from: accounts[0] });
  }

  onFinalize = async () => {
    const campaign = getCampaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    await campaign.methods.finalizeRequest(this.props.id).send({ from: accounts[0] });
  }


  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = request.approvalCount > approversCount / 2;

    return (
      <Row disabled={request.complete} positive={readyToFinalize && !request.complete}>
        <Cell>{id}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, 'ether')}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>{request.approvalCount}/{approversCount}</Cell>
        <Cell>
          { request.complete ? null :
          <Button onClick={this.onApprove} color="green" basic>approve</Button>
          }
        </Cell>
        <Cell>
          { request.complete ? <p>approved</p> :
          <Button color="teal" basic onClick={this.onFinalize}>finalize</Button>
          }
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;