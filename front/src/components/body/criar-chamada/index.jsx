import { Button, ButtonGroup, Stack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import axios from 'axios'



function CriarChamada(props){
    function createNewRollCall(){
        axios.post('http://localhost:3000/admin/rollCall',{},{
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