import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./routes/Home.tsx";
import Events from "./routes/Events.tsx";
import Login from "./routes/Login.tsx";
import {
  ChakraProvider,Container, Flex,
} from '@chakra-ui/react';

function App() {
  return (
    <ChakraProvider>
      <Flex h="100vh" align="center" justify="center" grow={1}>
        <Container centerContent maxW='5xl'>
          <BrowserRouter>
            <Routes>
              <Route path="/">
                <Route index element={<Home/>}/>
                <Route path="/events" element={<Events/>}/>
                <Route path="/login" element={<Login/>}/>
              </Route>
            </Routes>
          </BrowserRouter>
        </Container >
      </Flex>
    </ChakraProvider>
  );
}

export default App;
