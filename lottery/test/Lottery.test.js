const assert = require('assert')
const ganache = require('ganache-cli')
const Web3 = require('web3')
const web3 = new Web3(ganache.provider())
const { interface, bytecode } = require('../compile')

let accounts
let lottery

beforeEach(async () => {
  // Get a list of all accounts
  accounts = await web3.eth.getAccounts()

  // Use one of those accounts to deploy
  // the contract
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: '1000000' })
})

describe('Lottery Contract', () => {
  it('contract is deploying', () => {

    //check if the contract is deployed successfully
    assert.ok(lottery.options.address);
  })

  it('One Person can enter the lottery', async () => {

    //enter a contract with a account and seend 0.03 ether as wei
    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei('0.03', 'ether')
    })

    //get the list of players after enterting the lottery pool
    const players = await lottery.methods.getPlayers().call({
      from: accounts[0]
    })

    //check if the account which we used to enter is 
    //equal to the account at the 0th index in players array
    assert.equal(accounts[0], players[0])
  })

  it('Minimum amount of ether is required to enter the contest', async () => {
    try {
      await lottery.methods.enter().send({
        from: accounts[0],
        value: 0
      })

      assert(false);

    } catch (err) {
      assert(err)
    }
  })

  it('only manager is allowed to pick a winner of the lottery', async () => {
    try {
      await lottery.methods.pickWinner().send({
        from: accounts[0]
      })
      assert(false)

    } catch (err) {
      assert(err)
    }
  })


})