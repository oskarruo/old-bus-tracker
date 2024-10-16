import React, { useState } from "react";
import { Box, Button, Collapse } from "@chakra-ui/react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const HOST_ADDRESS = import.meta.env.VITE_HOST_ADDRESS || "localhost";
const TILE_SERVER_URL = `http://${HOST_ADDRESS}:3000/tiles/{z}/{x}/{y}`;

const opers = {
  12: "Koiviston Auto",
  17: "Tammelundin Liikenne",
  20: "Åbergin Linja",
  51: "Korsisaari",
};

const Map = ({ buses }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [show, setShow] = useState(false);

  const handleToggle = () => {
    setShow(!show);
    setTimeout(() => setIsOpen(!isOpen), 100);
  };

  const busIcon = (heading, route, veh) =>
    L.divIcon({
      html: `<div>
           <div style="transform: rotate(${heading}deg);">
             <img src="symbol.png" style="width: 40px; height: 30px;" alt="Bus direction" />
           </div>
           <div style="text-align: center; margin-top: 5px;">
             <span class="my-div-span">${route}</span>
           </div>
           <div style="text-align: center; margin-top: 5px;">
             <span class="my-div-span">${veh}</span>
           </div>
         </div>`,
      iconSize: [40, 30],
      className: "",
    });

  return (
    <div>
      <Button colorScheme="blue" onClick={handleToggle} mt={4}>
        {show ? "Close Map" : "Open Map"}
      </Button>

      <Collapse mt={4} in={show}>
        <Box
          mt={4}
          width="100%"
          height="40vh"
          borderRadius="md"
          overflow="hidden"
        >
          {isOpen && (
            <MapContainer
              center={[60.1708, 24.9414]}
              zoom={12}
              style={{ height: "100%", width: "100%" }}
              whenCreated={(map) => {
                setTimeout(() => map.invalidateSize(), 0);
              }}
            >
              <TileLayer url={TILE_SERVER_URL} />
              {Object.values(buses).map(
                (bus, index) =>
                  Object.values(bus["msg"])[0].lat &&
                  Object.values(bus["msg"])[0].long &&
                  Object.values(bus["route"]) &&
                  Object.values(bus["route"])[
                    Object.values(bus["msg"])[0].dir - 1
                  ]["data"] && (
                    <Marker
                      key={index}
                      position={[
                        Object.values(bus["msg"])[0].lat,
                        Object.values(bus["msg"])[0].long,
                      ]}
                      icon={busIcon(
                        Object.values(bus["msg"])[0].hdg || 0,
                        Object.values(bus["route"])[
                          Object.values(bus["msg"])[0].dir - 1
                        ]["data"]["pattern"]["route"]["shortName"],
                        Object.values(bus["msg"])[0].veh,
                      )}
                    >
                      <Popup>
                        <div>
                          <p>
                            <strong>Vehicle:</strong>{" "}
                            {opers[Object.values(bus["msg"])[0].oper]}{" "}
                            {Object.values(bus["msg"])[0].veh}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  ),
              )}
            </MapContainer>
          )}
        </Box>
      </Collapse>
    </div>
  );
};

export default Map;
