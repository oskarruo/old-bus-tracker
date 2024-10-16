import React, { useState } from "react";
import {
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
} from "@chakra-ui/react";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";

const opers = {
  12: "Koiviston Auto",
  17: "Tammelundin Liikenne",
  20: "Åbergin Linja",
  51: "Korsisaari",
};

const BusCard = ({ busdata }) => {
  const [isOpen, setIsOpen] = useState(false);

  const posdata = busdata?.msg ? Object.values(busdata.msg)[0] : null;
  const dir = posdata?.dir;
  const routedata = busdata?.route ? busdata.route[dir] : null;
  const laststop = busdata?.laststop;

  let laststop_index;
  let stops = [];
  let activeStep = 0;

  if (routedata?.data) {
    laststop_index = routedata.data.pattern.stops.findIndex(
      (stop) => stop.gtfsId.split(":")[1] == laststop,
    );
    stops = routedata.data.pattern.stops.map((stop) => stop.name);
    activeStep = laststop_index;
  }

  const handleAccordionToggle = () => {
    setTimeout(() => setIsOpen(!isOpen), 100);
  };

  return (
    <div>
      <AccordionItem>
        <AccordionButton onClick={handleAccordionToggle}>
          <Box as="span" flex="1" textAlign="left">
            {routedata?.data && (
              <Text fontSize="1xl" fontWeight="bold">
                {routedata.data.pattern.route.shortName}{" "}
                {routedata.data.pattern.headsign}
              </Text>
            )}
            {posdata && (
              <Text>
                {opers[posdata.oper]} {posdata.veh}
              </Text>
            )}
          </Box>
          <AccordionIcon />
        </AccordionButton>

        <AccordionPanel pb={4}>
          {routedata?.data && laststop_index >= 0 && stops.length > 0 ? (
            <div style={{ maxWidth: "100%" }}>
              <Box
                sx={{
                  overflowX: "auto",
                  "&::-webkit-scrollbar": {
                    width: "5px",
                    height: "8px",
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "#b0b0b0",
                    borderRadius: "10px",
                  },
                  "&::-webkit-scrollbar-thumb:hover": {
                    backgroundColor: "#888888",
                  },
                  "&::-webkit-scrollbar-track": {
                    backgroundColor: "#f0f0f0",
                  },
                }}
              >
                <Stepper activeStep={activeStep} alternativeLabel>
                  {stops.map((label, index) => (
                    <Step key={`${label}-${index}`}>
                      <StepLabel>{label}</StepLabel>
                    </Step>
                  ))}
                </Stepper>
              </Box>
            </div>
          ) : (
            <Text>No route data available :(</Text>
          )}
        </AccordionPanel>
      </AccordionItem>
    </div>
  );
};

export default BusCard;
