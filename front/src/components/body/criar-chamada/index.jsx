import { Button, ButtonGroup, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'



function CriarChamada(props){
    const BASE_API = import.meta.env.VITE_BASE_API
    function createNewRollCall(){
        axios.post(`${BASE_API}/admin/rollCall`,{},{
            headers:{
                'Authorization': `Bearer ${props.jwt}`
            }
        }).then((response)=>{
            props.setRollCallId(response.data.id)
        }).catch((error)=>{
            props.setRollCallId(error.response.data.idRollCallAlreadyOpen)
        })
    }

    return (
        <Stack direction='column' align='center'>
            <Button colorScheme='blue' mt="5vw" onClick={createNewRollCall}>Iniciar Chamada</Button>
        </Stack>
    )
}

export default CriarChamada