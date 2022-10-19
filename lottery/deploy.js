const HDWalletProvider = require('@truffle/hdwallet-provider');
const Web3 = require('web3');
const { interface, bytecode } = require('./compile');

const provider = new HDWalletProvider(
  'easy bunker pass enroll sausage tribe green suit slow party damage cake',
  // remember to change this to your own phrase!
  'https://frosty-capable-card.ethereum-goerli.discover.quiknode.pro/57a47e849babccd5f99103c5cbb07ce77eb22178/'
  // remember to change this to your own endpoint!
);
const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log('Attempting to deploy from account', accounts[0]);

  const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ gas: '1000000', from: accounts[0] });

  console.log(interface)
  console.log('Contract deployed to', result.options.address);
  provider.engine.stop();
};
deploy();
