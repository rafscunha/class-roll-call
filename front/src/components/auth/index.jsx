import { Box, useBoolean } from '@chakra-ui/react'
import { Input, Stack, AbsoluteCenter, Text, Button } from '@chakra-ui/react'
import axios from 'axios'
import { useEffect, useState } from 'react'
import * as fetchSync from 'sync-fetch';


function AuthModal(props){
    const BASE_API = import.meta.env.VITE_BASE_API
    const [user, setUser] = useState(null)
    const [passWord, setPassWord] = useState(null)

    function auth(){
        if (!!user && !!passWord){
            axios.post(`${BASE_API}/auth`,{},{
            auth:{
                username: user,
                password: passWord
            }
            })
            .then((response)=>{
            const jwt = response.data.access_token
            props.setJwt(jwt)
            })
            .catch((error)=>{
            console.error(error)
            })
        }
    }

    return (
        <Box position='relative' h='100px' mt='20vw' >
            <AbsoluteCenter bg='#2a69ac' p='4' color='white' axis='both' borderRadius='md'>
                <Stack spacing={3}>
                    <Text fontSize='4xl' align='center'>Login</Text>
                    <Input placeholder='Login' size='md' bg='white' color='black' onBlur={evt=>setUser(evt.target.value)}/>
                    <Input placeholder='Senha' size='md' type='password' bg='white' color='black' onBlur={evt=>setPassWord(evt.target.value)}/>
                    <Button colorScheme='linkedin' size='sm' onClick={auth} >Entrar</Button>
                </Stack>
            </AbsoluteCenter>
        </Box>
    )
}

export default AuthModal
