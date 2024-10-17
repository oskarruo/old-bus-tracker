require('dotenv').config();

const express = require("express");
const axios = require("axios");
const http = require("http");
const WebSocket = require("ws");
const mqtt = require("mqtt");
const fetch = require("node-fetch");

const app = express();
const PORT = process.env.PORT || 3000;
const TILE_SERVER_URL = "https://cdn.digitransit.fi/map/v2/hsl-map";
const API_KEY = process.env.API_KEY;

const server = http.createServer(app);

const wss = new WebSocket.Server({ server });

const mqttClient = mqtt.connect("mqtts://mqtt.hsl.fi:8883");
const routedetails = {};
const laststops = {};

mqttClient.on("connect", () => {
  mqttClient.subscribe([
    "/hfp/v2/journey/+/+/bus/0012/00905/#",
    "/hfp/v2/journey/+/+/bus/0012/00956/#",
    "/hfp/v2/journey/+/+/bus/0012/00957/#",
    "/hfp/v2/journey/+/+/bus/0012/01006/#",
    "/hfp/v2/journey/+/+/bus/0012/01007/#",
    "/hfp/v2/journey/+/+/bus/0012/01008/#",
    "/hfp/v2/journey/+/+/bus/0020/00088/#",
    "/hfp/v2/journey/+/+/bus/0051/00010/#",
    "/hfp/v2/journey/+/+/bus/0051/00097/#",
    "/hfp/v2/journey/+/+/bus/0051/00022/#",
    "/hfp/v2/journey/+/+/bus/0051/00024/#",
    "/hfp/v2/journey/+/+/bus/0051/00025/#",
  ]);
});

mqttClient.on("message", async (topic, payload) => {
  const message = payload.toString();
  const parsedMessage = JSON.parse(message);
  const route = Object.values(parsedMessage)[0].route;
  const stop = Object.values(parsedMessage)[0].stop;
  const veh_ident =
    String(Object.values(parsedMessage)[0].oper) +
    String(Object.values(parsedMessage)[0].veh);

  let data_dir_1;
  let data_dir_2;

  if (!routedetails[route]) {
    let query = `
    {
      pattern(id: "HSL:${route}:0:01") {
        name
        headsign
        stops {
          name
          gtfsId
        }
        route {
          shortName
        }
      }
    }
    `;

    try {
      const response = await fetch(
        "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "digitransit-subscription-key": API_KEY,
          },
          body: JSON.stringify({ query }),
        },
      );
      data_dir_1 = await response.json();
    } catch (error) {
      console.error("Error fetching routes:", error);
    }

    query = `
    {
      pattern(id: "HSL:${route}:1:01") {
        name
        headsign
        stops {
          name
          gtfsId
        }
        route {
          shortName
        }
      }
    }
    `;

    try {
      const response = await fetch(
        "https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "digitransit-subscription-key": API_KEY,
          },
          body: JSON.stringify({ query }),
        },
      );
      data_dir_2 = await response.json();
    } catch (error) {
      console.error("Error fetching routes:", error);
    }
    routedetails[route] = { 1: data_dir_1, 2: data_dir_2 };
  }

  if (stop) {
    laststops[veh_ident] = stop;
  }

  const sendable = JSON.stringify({
    route: routedetails[route],
    message: parsedMessage,
    laststop: laststops[veh_ident],
  });

  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(sendable);
    }
  });
});

app.get("/tiles/:z/:x/:y", async (req, res) => {
  const { z, x, y } = req.params;
  try {
    const response = await axios.get(`${TILE_SERVER_URL}/${z}/${x}/${y}.png`, {
      headers: {
        "digitransit-subscription-key": API_KEY,
      },
      responseType: "arraybuffer",
    });
    res.set("Content-Type", "image/png");
    res.send(response.data);
  } catch (error) {
    res.status(500).send("Error fetching tile data");
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
