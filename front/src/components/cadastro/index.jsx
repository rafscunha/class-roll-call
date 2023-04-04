import { Button, ButtonGroup, Stack, FormControl, FormLabel, Input, Box, AbsoluteCenter, Tag, Alert, AlertIcon } from '@chakra-ui/react'
import { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import axios from 'axios'



function AssignRollCall(props){
    //let match = useRouteMatch()
    let { id } = useParams()
    console.log(id)


    //const [needCreate, setNeedCreate] = useState(false)
    const [name, setName] = useState(null)
    const [ra, setRa] = useState(null)
    const [content, setContent] = useState(null)


    function registerStudant(){
        if (!!name && !! ra){
            axios.post(`http://localhost:3000/assign`,{
                name: name,
                ra: ra
            })
            .then((response)=>{
                if(response?.data?.studentId){
                    localStorage.setItem("STUDENT-ID", response.data.studentId)
                    assignRollCall()
                }
            })
            .catch((error)=>{
                console.error(error)
            })
        }
    }

    function assignRollCall(){
        const studentId = localStorage.getItem("STUDENT-ID")
        console.log("verificou...", studentId)
        if(!!studentId){
            axios.get(`http://localhost:3000/assign/${id}/${studentId}`,{
                studentId:studentId
            })
            .then((response)=>{
                if (response.status == 202){
                    setSuccessAssign()
                }
            })
            .catch((error)=>{
                const res = error.response
                if (res.status == 400){
                    setErrorAssign(res.data.message)
                }
            })
        }else{
            setNeedRegister()
        }
    }

    useEffect(()=>{
        assignRollCall()
    },[])

    function setSuccessAssign(){
        setContent(
            <AbsoluteCenter  p='4' color='white' axis='both' borderRadius='md'>
                <Alert status='success' align="center">
                    <AlertIcon />
                    Chamada Assinada
                </Alert>
            </AbsoluteCenter>
        )
    }

    function setErrorAssign(error){
        setContent(
            <AbsoluteCenter  p='4' color='white' axis='both' borderRadius='md'>
                <Tag size='lg' key='key' variant='solid' colorScheme='red' mb="20px">{error}</Tag>
            </AbsoluteCenter>
        )
    }

    function setNeedRegister(){
        setContent (
            <AbsoluteCenter bg='#2a69ac' p='4' color='white' axis='both' borderRadius='md'>
                <FormControl align="center">
                    <FormLabel>Nome Completo</FormLabel>
                    <Input type='text' onBlur={evt=>setName(evt.target.value)} />
                    <FormLabel mt="15px">Ra</FormLabel>
                    <Input type='number' onBlur={evt=>setRa(evt.target.value)}/>
                    <Button colorScheme='linkedin' align="center" mt="15px" onClick={registerStudant}>Cadastrar</Button>
                </FormControl>
            </AbsoluteCenter>
        )
    }
    return (
        <Box position='relative' h='100px' mt='10vw'>
                {content}
        </Box>
    )
}

export default AssignRollCall