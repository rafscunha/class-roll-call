import React, { useEffect, useState } from 'react'
import './App.css'
import MenuTop from './components/menu/Index'
import NovaChamada from './components/body/nova-chamada'
import CriarChamada from './components/body/criar-chamada'
import AuthModal from './components/auth/index'
import axios from 'axios'

function App(){

  const [rollCallId, setRollCallId] = useState(null)
  const [jwt, setJwt] = useState(null)

  useEffect(()=>{console.log(jwt)}, [jwt])

  function rollCall(){
    if (rollCallId != null){
      return <NovaChamada jwt={jwt} rollCallId={rollCallId}/>
    }else{
      return <CriarChamada jwt={jwt} setRollCallId={setRollCallId}/>
    }
  }

  function isAuthenticate(){
    if (jwt == null){
      return <AuthModal setJwt={setJwt}/>
    }else{
      return (
        <div >
          <MenuTop />
          {rollCall()}
        </div>
      )
    }
  }
  
  return (
    <div id="princial-tela" className='princiapl-tela-class'>
      {isAuthenticate()}
    </div>
  )
  
}


export default App
