import React, { useEffect, useState } from 'react'
import '/app/src/App.css'
import MenuTop from '/app/src/components/menu'
import NovaChamada from '/app/src/components/body/nova-chamada'
import CriarChamada from '/app/src/components/body/criar-chamada'
import AuthModal from '/app/src/components/auth/index'
import axios from 'axios'
import ListRollCall from '/app/src/components/rollcalls'

function App(){

  const [rollCallId, setRollCallId] = useState(null)
  const [jwt, setJwt] = useState(null)
  const [content, setContent] = useState(null)
  const [option, setOption] = useState(null)
  const [main, setMain] = useState(null)

  useEffect(()=>{
    if(jwt != null){
      // setMain(
      //   <div >
      //     <MenuTop setOption={setOption}/>
      //     {content}
      //   </div>
      // )
      setOption("NewRollCall")
    }
  }, [jwt])

  useEffect(()=>{
    if(jwt != null){
      setMain(
        <div >
          <MenuTop setOption={setOption}/>
          {content}
        </div>
      )
    }
  }, [content])

  useEffect(()=>{
    switch(option){
      case "RollCall":
        setContent(<NovaChamada jwt={jwt} rollCallId={rollCallId}/>)
        break;
      
      case "NewRollCall":
        setContent(<CriarChamada jwt={jwt} setRollCallId={setRollCallId}/>)
        break;

      case "ListOfRollCalls":
        setContent(<ListRollCall jwt={jwt} setOption={setOption} setRollCallId={setRollCallId}/>)
        break;
    }
  },[option])

  useEffect(()=>{
    if (rollCallId != null){
      setOption("RollCall")
    }
  },[rollCallId])


  // function rollCall(){
  //   if (rollCallId != null){
  //     return <NovaChamada jwt={jwt} rollCallId={rollCallId}/>
  //   }else{
  //     return <CriarChamada jwt={jwt} setRollCallId={setRollCallId}/>
  //   }
  // }

  // useEffect(()=>{

  // },[content])


  useEffect(()=>{
    setMain(<AuthModal setJwt={setJwt}/>) 
  },[])

  // function isAuthenticate(){
  //   if (jwt == null){
  //     return <AuthModal setJwt={setJwt}/>
  //   }else{
  //     return (
  //       <div >
  //         <MenuTop setOption={setOption}/>
  //         {content}
  //       </div>
  //     )
  //   }
  // }
  
  return (
    <div id="princial-tela" className='princiapl-tela-class'>
      {main}
    </div>
  )
  
}


export default App
