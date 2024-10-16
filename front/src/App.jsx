import React, { useEffect, useState, useRef } from "react";
import BusCard from "./components/BusCard";
import Map from "./components/Map";
import { ChakraProvider, Box, Text, Accordion, Link } from "@chakra-ui/react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { FaGithub } from "react-icons/fa";

const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS || "localhost";
const WEBSOCKET_URL = `ws://${HOST_ADDRESS}:8080`;

const theme = createTheme();

function App() {
  const [buses, setBuses] = useState({});
  const busTimers = useRef({});

  useEffect(() => {
    const ws = new WebSocket(WEBSOCKET_URL);

    ws.onmessage = async (event) => {
      const msg = JSON.parse(event.data);
      const veh = String(Object.values(msg.message)[0].veh);
      const oper = String(Object.values(msg.message)[0].oper);
      const busKey = oper + veh;
      const laststop = msg.laststop;

      if (busTimers.current[busKey]) {
        clearTimeout(busTimers.current[busKey]);
      }

      busTimers.current[busKey] = setTimeout(() => {
        setBuses((prevBuses) => {
          const newBuses = { ...prevBuses };
          delete newBuses[busKey];
          return newBuses;
        });
        delete busTimers.current[busKey];
      }, 60000);

      setBuses((prevBuses) => {
        return {
          ...prevBuses,
          [busKey]: { msg: msg.message, route: msg.route, laststop: laststop },
        };
      });
    };

    return () => {
      ws.close();
      Object.values(busTimers.current).forEach(clearTimeout);
    };
  }, []);

  return (
    <ChakraProvider>
      <Box
        backgroundImage="url('/bg.jpg')"
        backgroundSize="cover"
        backgroundPosition="center"
        backgroundAttachment="fixed"
        height="100vh"
        width="100vw"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
      >
        <Box
          bg="white"
          width={["90%", "30%"]}
          padding={6}
          borderRadius="md"
          boxShadow="lg"
          overflowY="auto"
          maxHeight="80vh"
          sx={{
            "&::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <Box
            direction="column"
            alignItems="center"
            justifyContent="center"
            w="100%"
          >
            <Text fontSize="4xl" fontWeight="bold" align="center" mb={2}>
              Helsinki Old Bus Tracker
            </Text>
            <Text fontSize="1xl" align="center" mb={2}>
              A list of old non HSL colored buses in Helsinki that are on route
              now
            </Text>
            <Accordion allowMultiple>
              <ThemeProvider theme={theme}>
                {Object.values(buses).map((bus, index) => (
                  <BusCard key={index} busdata={bus} />
                ))}
              </ThemeProvider>
              {Object.keys(buses).length === 0 && (
                <Text fontSize="2xl" align="center" mt={20} mb={20}>
                  No buses on route just now :(
                </Text>
              )}
            </Accordion>
          </Box>
          <Map buses={buses} />
        </Box>
        <Box
          position="absolute"
          bottom={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          bg="white"
          borderRadius="md"
          boxShadow="md"
          p={2}
        >
          <Text fontSize="1xl">
            Position and Route Data: © Digitransit 2024
          </Text>
          <Text fontSize="1xl">
            Bus Color Information:{" "}
            <Link href="https://www.kooen202.com/39920" isExternal>
              kooen202.com
            </Link>
          </Text>
        </Box>
        <Box
          as="a"
          href="https://github.com/"
          target="_blank"
          position="absolute"
          bottom={4}
          right={4}
          display="flex"
          alignItems="center"
          justifyContent="center"
          bg="white"
          borderRadius="full"
          boxShadow="md"
          p={2}
        >
          <FaGithub size="24px" />
        </Box>
      </Box>
    </ChakraProvider>
  );
}

export default App;
