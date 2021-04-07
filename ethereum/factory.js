import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi, 
    '0x10B244D3cC1223E292c0Ed6A93DD32b4C7A525cA'
);

export default instance;