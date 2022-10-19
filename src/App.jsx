import React, { useEffect, useState } from 'react'
import web3 from './web3/web3'
import lottery from './web3/lottery'



const App = () => {

  const [manager, setManager] = useState('')
  const [players, setPlayers] = useState([])
  const [balance, setBalance] = useState('')
  const [myMoney, setMyMoney] = useState(0)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    if(!loading){
      (async function() {
  
        const managerPerson = await lottery.methods.manager().call()
        const players = await lottery.methods.getPlayers().call()
        const balance = await web3.eth.getBalance(lottery.options.address);
        setManager(managerPerson)
        setPlayers(players)
        setBalance(balance)
      })();
    }
    
  },[loading])

  const handleLotteryEnterSubmit = async (e)=>{
    e.preventDefault()
    
    setLoading(true)

    const accounts = await web3.eth.getAccounts()

    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(myMoney, 'ether')
    })

    setLoading(false)
  }

  const handlePickWinner =async ()=>{
    setLoading(true);
    const accounts= await web3.eth.getAccounts()

    await lottery.methods.pickWinner().send({
      from:accounts[0]
    })

    setLoading(false)
  }
  
  return (
  <div>
    {loading && <h1>Loading...</h1>}
    {!loading &&  <div>
    <h1>
      The Contract is managed by {manager}
    </h1>
    <h2>
      Players Regeesitered for the Game: 
      {
        players.map((p)=>{
          return <p key={p}>{p}</p>
        })
      }
    </h2>
    <h1>
      Your Balance is {web3.utils.fromWei(balance, 'ether')}
    </h1>
    <h1>
      Enter the value you want to use to enter the Lottery:
    </h1>
    <form onSubmit={handleLotteryEnterSubmit}>
    <input type={'number'} value={myMoney} onChange={e=>setMyMoney(e.target.value)}/>
    <button type='submit'>Enter The Lottery</button>
    </form>
    <div>
      <h1>Pick a Winner</h1>
      <button type='button' onClick={handlePickWinner}>Pick A Winner</button>
    </div>
    </div>}
  </div>
  )
}

export default App