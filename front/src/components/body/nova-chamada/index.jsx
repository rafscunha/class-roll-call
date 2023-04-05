import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, Link } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { Divider } from '@chakra-ui/react';
import useWebSocket from 'react-use-websocket';
import * as fetchSync from 'sync-fetch';
import { CheckIcon } from '@chakra-ui/icons'


import {
    Table,
    Thead,
    Tbody,
    Tfoot,
    Tr,
    Th,
    Td,
    TableCaption,
    TableContainer,
    Button,
    Tag
  } from '@chakra-ui/react'
import axios from 'axios';


function NovaChamada(props){
    const BASE_API = import.meta.env.VITE_BASE_API
    const BASE_WSS = import.meta.env.VITE_BASE_WSS
    const LOCATION_URL = window.location.href

    const [socketUrl, setSocketUrl] = useState(BASE_WSS)
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl,{
        queryParams:{
            'X-ROLLCALL-ID':props.rollCallId
        }
    }, true)
    const [urlQrCode, setUrlQrCode] = useState(null)
    const [studentsAssigned, setStudentsAssigned] = useState([]);
    const [rollCallOpen, setRollCallOpen] = useState(false)
    const [elementQrCode, setElementQrCode] = useState()
    const [currentUri, setCurrentUri] = useState(null)


    async function getStudentsAssigned(){
        console.log("JWT",props.jwt)
        axios.get(`${BASE_API}/admin/rollCall/list/${props.rollCallId}`,{
            headers:{
                'Authorization': `Bearer ${props.jwt}`
            }
        })
        .then((response)=>{
            setStudentsAssigned(response.data.students)
        })
        .catch((error)=>{
            console.error(error)
        })
    }


    useEffect(()=>{
        if(lastMessage?.data){
            const newMessage = JSON.parse(lastMessage?.data)
            //console.log(newMessage)
            switch(newMessage.type){
                case "NewQrCode":
                    //console.log("NewQrCode>>",newMessage.data.id)
                    setCurrentUri(`${LOCATION_URL}assign/${newMessage.data.id}`)
                    getStudentsAssigned()
                    //setUrlQrCode(`https://api.qrserver.com/v1/create-qr-code/?data=${currentUri}&amp;size=300x300`)
                    setRollCallOpen(true)
                    break;
                
                case "AssignRollCall":
                    //console.log("AssignRollCall>>",newMessage.data)
                    const data = newMessage.data
                    setStudentsAssigned([{
                        name: data.name,
                        ra: data.ra,
                        assigned: data.assignIn
                    },...studentsAssigned])
                    setCurrentUri(`${LOCATION_URL}assign/${data.newQrCode}`)
                    
                    break;
                
                case "CloseRollCall":
                    //console.log("CloseRollCall>>",newMessage.data)
                    setRollCallOpen(false)
                    break;
            }
        }
    },[lastMessage])

    useEffect(()=>{
        setUrlQrCode(`https://api.qrserver.com/v1/create-qr-code/?data=${currentUri}&amp;size=300x300`)
    },[currentUri])

    function buttaoClick(){
        //console.log(`Bearer ${props.jwt}`)
        axios.patch(`${BASE_API}/admin/rollCall/${props.rollCallId}`,{},{
            headers:{
                'Authorization': `Bearer ${props.jwt}`
            }
        })
        .then(()=>{
            console.log("Closing RollCall")
        })
        .catch((error)=>{
            console.error(error)
        })
        .finally(()=>{
            setRollCallOpen(false)
        })
        
    }

    useEffect(()=>{
        if (rollCallOpen){
            setElementQrCode(
                <CardBody align='center'>
                    <Heading size='sm' mt='10px'>{props.rollCallId}</Heading>
                    <Heading size='sm' textTransform='uppercase'> 30 de Abril de 2013 </Heading>
                    <Image src={urlQrCode} pt="20px" pb="20px" href={urlQrCode}/>
                    <Stack direction='row' spacing={4} align="center" display="flex">
                        <Link href={currentUri} style={{ textDecoration: 'none' }} isExternal>
                            <Button leftIcon={<CheckIcon />} colorScheme='whatsapp' variant='solid' align="center">
                                Assinar Manual
                            </Button>
                        </Link>
                        <Button colorScheme='blue' onClick={buttaoClick} align="center">Finalizar Chamada</Button>
                    </Stack>
                </CardBody>
            )
        }else{
            setElementQrCode(
                <Tag size='lg' key='key' variant='solid' colorScheme='red' mb="20px">Chamada Encerrada</Tag>
            )
        }
    },[rollCallOpen, urlQrCode, lastMessage])


    return (
        <Card align='center'>
            <CardHeader align='center'>
                <Heading size='lg'> Registro de Chamada</Heading>
            </CardHeader>
            {elementQrCode}
            <TableContainer>
                <Heading size='sm' align="center">Registrados na chamada</Heading>
                <Table variant='simple'>
                    <Thead>
                    <Tr>
                        <Th>Nome</Th>
                        <Th>Ra</Th>
                        <Th>Hora</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {studentsAssigned.map((student)=>(
                            <Tr id={`id-tr${student.ra}`}>
                                <Td id={`id-td-name-${student.ra}`}>{student.name}</Td>
                                <Td id={`id-td-ra-${student.ra}`}>{student.ra}</Td>
                                <Td id={`id-td-assigned-${student.ra}`}>{student.assigned}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

        </Card>
    )
}

export default NovaChamada