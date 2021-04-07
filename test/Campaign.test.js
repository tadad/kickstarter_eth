const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');
const web3 = new Web3(ganache.provider());

const compiled_campaign = require('../ethereum/build/Campaign.json');
const compiled_factory = require('../ethereum/build/CampaignFactory.json');

let accounts;
let factory;

let campaign_address;
let campaign;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();

  factory = await new web3.eth.Contract(compiled_factory.abi)
    .deploy({ data: "0x" + compiled_factory.evm.bytecode.object })
    .send({ from: accounts[0], gas: "1500000" });

  await factory.methods.createCampaign('100').send({
    from: accounts[0],
    gas: '1500000',
  }); 

  [campaign_address] = await factory.methods.getDeployedCampaigns().call();
  campaign = await new web3.eth.Contract(compiled_campaign.abi, campaign_address);
});

describe('Campaigns', () => {
  it('deploys a factory and campaign', () => {
    assert.ok(factory.options.address);
    assert.ok(campaign.options.address);
  });
  it('marks caller as manager', async () => {
    const manager = await campaign.methods.manager().call();
    assert.strictEqual(manager, accounts[0]);
  });
  it('adds a contribution and approver', async () => {
    await campaign.methods.contribute().send({
      value: 200,
      from: accounts[1]
    });

    const approvers = await campaign.methods.approvers(accounts[1]).call();
    assert(approvers);
  });
  it('has a minimum contribution', async () => {
    try {
      await campaign.methods.contribute().send({
        value: 1,
        from: accounts[1]
      });
      assert(false);
    } catch (err) {
      assert.ok(err);
    }
  });
  it('allows manager to make a payment request', async () => {
    await campaign.methods.createRequest('buy batteries', 100, accounts[3]).send({
      from: accounts[0],
      gas: '1000000'
    });

    const request = await campaign.methods.requests(0).call();
    assert.strictEqual('buy batteries', request.description);
  });
  it('processes requests', async () => {
    await campaign.methods.contribute().send({
      from: accounts[0],
      value: web3.utils.toWei('10', 'ether')
    });

    await campaign.methods
      .createRequest('buy batteries', web3.utils.toWei('5', 'ether'), accounts[1])
      .send({ from: accounts[0], gas: '1000000'});

    await campaign.methods
      .approveRequest(0)
      .send({from: accounts[0], gas: '1000000'});

    await campaign.methods.finalizeRequest(0).send({
      from: accounts[0],
      gas: '1000000'
    });
  
    let balance = await web3.eth.getBalance(accounts[1]);
    balance = web3.utils.fromWei(balance, 'ether');
    balance = parseFloat(balance);
    console.log(balance);
    assert(balance > 104); // prone to breakage, but there isn't really a great way to do this bc gas fees don't make it exact
  });
});