import Web3 from 'web3';

let web3;

if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);

  // there is some other code that goes right here but idk what it is so I'm going to leave it out for now...

  window.ethereum
    .enable()
    .then(_accounts => {})
    .catch(error => {
      console.error(error);
      alert("Sorry, this application requires user approval to function correctly.");
    })
} else {
  const provider = new Web3.providers.HttpProvider(
    'https://rinkeby.infura.io/v3/8901857b01c348bbbcf9eefe3b7a9167'
  );
  
  web3 = new Web3(provider );
}

export default web3;