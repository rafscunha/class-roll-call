import axios from "axios"
import { useEffect, useState } from "react"
import { Card, CardHeader, CardBody, Stack, Link,Table,
    Thead,
    Tbody,Tr,
    Th,
    Td,Tfoot,
    TableCaption,
    TableContainer,
    Button,
    Tag,
    Heading
 } from '@chakra-ui/react'
 import { ExternalLinkIcon, CheckCircleIcon, SpinnerIcon } from '@chakra-ui/icons'
 import { Spinner } from '@chakra-ui/react'



function ListRollCall(props){
    const BASE_API = import.meta.env.VITE_BASE_API

    useEffect(()=>{
        props.setRollCallId(null)
    },[])

    const [listRollCalls, setListRollCalls] = useState([])


    useEffect(()=>{
        axios.get(`${BASE_API}/admin/rollCall/list`,{
            headers:{
                'Authorization': `Bearer ${props.jwt}`
            }
        })
        .then((response)=>{
            setListRollCalls(response.data)
        })
        .catch((error)=>{
            console.error(error)
        })
    },[])

    function getDateToShow(dateString){
        const today = new Date(dateString)
        return `${today.getDate()}/${today.getMonth()}/${today.getFullYear()}`
    }
    function getTimeToShow(dateString){
        const today = new Date(dateString)
        today.getDay
        return `${today.getHours()-3}:${today.getMinutes()}:${today.getSeconds()}`
    }

    function redirectToRollCall(value){
        props.setRollCallId(value)
    }

    return (
        <Card align='center'>
            <CardHeader >
                <Heading size='lg'>Chamadas</Heading>
            </CardHeader>
            <TableContainer>
                <Table variant='simple'>
                    <Thead>
                    <Tr>
                        <Th id="table-action">Action</Th>
                        <Th id="table-status">Status</Th>
                        <Th id="table-date">Date</Th>
                        <Th id="table-open">Open</Th>
                        <Th id="table-close">Close</Th>
                    </Tr>
                    </Thead>
                    <Tbody>
                        {listRollCalls.map((rollCall)=>(
                            <Tr id={`id-tr${rollCall.id}`} align="center">
                                <Td id={`id-td-action-${rollCall.id}`}>
                                    <Button colorScheme="cyan" variant='link' value={rollCall.id} onClick={()=>redirectToRollCall(rollCall.id)}>
                                        <ExternalLinkIcon />
                                    </Button>
                                </Td>
                                <Td id={`id-td-name-${rollCall.id}`}>
                                    {
                                        !rollCall.isOpen ? 
                                        <CheckCircleIcon color="green" size='sm'/> :
                                        <Spinner color='red.500' emptyColor='gray.200' thickness='2px' size='sm'/> 
                                    } 
                                </Td>
                                <Td id={`id-td-date-${rollCall.id}`}>{getDateToShow(rollCall.openIn)}</Td>
                                <Td id={`id-td-ra-${rollCall.id}`}>{getTimeToShow(rollCall.openIn)}</Td>
                                <Td id={`id-td-assigned-${rollCall.id}`}>{getTimeToShow(rollCall.closedIn)}</Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </TableContainer>

        </Card>
    )
}

export default ListRollCall