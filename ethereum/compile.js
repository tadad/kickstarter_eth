const path = require('path');
const solc = require('solc');
const fs = require('fs-extra');
const contractFileName = "Campaign.sol";

const buildPath = path.resolve(__dirname, 'build');
fs.removeSync(buildPath);

const campaign_path = path.resolve(__dirname, 'contracts', contractFileName);
const source = fs.readFileSync(campaign_path, 'utf-8');

const input = {
  language: "Solidity",
  sources: {},
  settings: {
    outputSelection: {
      "*": {
        "*": ["*"]
      }
    }
  }
};
input.sources[contractFileName] = {
  content: source
};

const output = JSON.parse(solc.compile(JSON.stringify(input)));
const contracts = output.contracts[contractFileName];

fs.ensureDirSync(buildPath);

for (let contract in contracts) {
  if (contracts.hasOwnProperty(contract)) {
    const element = contracts[contract];
    fs.outputJsonSync(
      path.resolve(buildPath, `${contract}.json`),
      contracts[contract]
    );
  }
}