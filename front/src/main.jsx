import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
//import './index.css'
import { ChakraBaseProvider } from '@chakra-ui/react'
import { extendTheme } from '@chakra-ui/react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import  AssignRollCall from './components/cadastro/index';

const colors = {
  brand: {
    900: '#1a365d',
    800: '#153e75',
    700: '#2a69ac',
  },
}

const theme = extendTheme({ colors })
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ChakraBaseProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}/>
          <Route path="/assign/:id" element={<AssignRollCall />}/>
        </Routes>
      </BrowserRouter>
      
    </ChakraBaseProvider>
  </React.StrictMode>,
)
