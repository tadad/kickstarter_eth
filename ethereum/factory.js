import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(
    CampaignFactory.abi, 
    '0xDE33210E2A509d0e45710cc3e9F9a04CE9E1edA7'
);

export default instance;