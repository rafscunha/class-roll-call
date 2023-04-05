
import React from 'react'
import '/app/src/components/menu/style.css'
import {
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
} from '@chakra-ui/react';
import { 
    HamburgerIcon, 
    AddIcon, 
    Search2Icon, 
    RepeatIcon, 
    CalendarIcon 
} from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { Box } from "@chakra-ui/react"

function MenuTop(){
    return (
        <Box bg='#2a69ac' w='100%' p={4} color='white' border='2px'>

            <Menu>
                <MenuButton
                as={IconButton}
                aria-label='Options'
                icon={<HamburgerIcon />}
                variant='outline'
                
                />
                <MenuList bg='#2a69ac'>
                    <MenuItem icon={<CalendarIcon />} command='⌘T' bg='#2a69ac' hover="#153e75">
                        Nova Chamada
                    </MenuItem>
                    <MenuItem icon={<Search2Icon />} command='⌘N' bg='#2a69ac'>
                        Buscar Chamada
                    </MenuItem>
                    <MenuItem icon={<AddIcon />} command='⌘⇧N' bg='#2a69ac'>
                        Cadastrar Turma
                    </MenuItem>
                </MenuList>
            </Menu>
        </Box>
        
    )
}
  
export default MenuTop