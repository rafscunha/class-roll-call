import { Card, CardHeader, CardBody, CardFooter, Heading } from '@chakra-ui/react'
import { Image } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react';
import { Divider } from '@chakra-ui/react';
import useWebSocket from 'react-use-websocket';

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



    const [socketUrl, setSocketUrl] = useState('ws://localhost:3000')
    const { sendMessage, lastMessage, readyState } = useWebSocket(socketUrl,{
        queryParams:{
            'X-ROLLCALL-ID':props.rollCallId
        }
    }, true)
    const [urlQrCode, setUrlQrCode] = useState("https://api.qrserver.com/v1/create-qr-code/?data=www.google.com&amp;size=300x300")
    const [studentsAssigned, setStudentsAssigned] = useState([]);
    const [rollCallOpen, setRollCallOpen] = useState(false)
    const [elementQrCode, setElementQrCode] = useState()



    useEffect(()=>{
        if(lastMessage?.data){
            const newMessage = JSON.parse(lastMessage?.data)
            console.log(newMessage)
            let url = null
            switch(newMessage.type){
                case "NewQrCode":
                    console.log("NewQrCode>>",newMessage.data.id)
                    setRollCallOpen(true)
                    url = `http://localhost:3000/${newMessage.data.id}`
                    setUrlQrCode(`https://api.qrserver.com/v1/create-qr-code/?data=${url}&amp;size=300x300`)
                    break;
                
                case "AssignRollCall":
                    console.log("AssignRollCall>>",newMessage.data)
                    const data = newMessage.data
                    setStudentsAssigned([{
                        name: data.name,
                        ra: data.ra,
                        assigned: data.assignIn
                    },...studentsAssigned])
                    url = `http://localhost:3000/${data.newQrCode}`
                    setUrlQrCode(`https://api.qrserver.com/v1/create-qr-code/?data=${url}&amp;size=300x300`)
                    break;
                
                case "CloseRollCall":
                    console.log("CloseRollCall>>",newMessage.data)
                    setRollCallOpen(false)
                    break;
            }
        }
    },[lastMessage])


    function buttaoClick(){
        console.log(`Bearer ${props.jwt}`)
        axios.patch(`http://localhost:3000/admin/rollCall/${props.rollCallId}`,{},{
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
                    <Image src={urlQrCode} pt="20px" pb="20px" href="{urlQrCode}"/>
                    <Button colorScheme='blue' onClick={buttaoClick}>Finalizar Chamada</Button>
                </CardBody>
            )
        }else{
            setElementQrCode(
                <Tag size='lg' key='key' variant='solid' colorScheme='red' mb="20px">Chamada Encerrada</Tag>
            )
        }
    },[rollCallOpen])


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
                            <Tr>
                                <Td>{student.name}</Td>
                                <Td>{student.ra}</Td>
                                <Td>{student.assigned}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                    <Tfoot>
                    <Tr>
                        <Th>To convert</Th>
                        <Th>into</Th>
                        <Th isNumeric>multiply by</Th>
                    </Tr>
                    </Tfoot>
                </Table>
            </TableContainer>

        </Card>
    )
}

export default NovaChamada