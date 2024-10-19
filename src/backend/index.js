const express = require("express");
const node_cache = require("node-cache");
const cors = require("cors");
const WebSocket = require("ws");

// Setup express, cache, and CORS
const app = express();
const cache = new node_cache({ stdTTL: 60 }); // Cache for 60 seconds
app.use(cors());
const port = process.env.PORT || 5500

// Setup HTTP server and WebSocket
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// WebSocket connection to handle both crypto data and market chart data
wss.on("connection", (ws) => {
  console.log("New websocket connection established.");

  ws.on("message", async (message) => {
    const parsedMessage = JSON.parse(message);
    const { type, id, days } = parsedMessage;

    if (type === "cryptoData") {
      handleCryptoData(id, ws);
    } else if (type === "marketChartData") {
      handleMarketChartData(id, days || "365", ws);
    } else {
      ws.send(JSON.stringify({ error: "Invalid message type." }));
    }
  });

  ws.on("close", () => {
    console.log("Websocket connection closed.");
  });
});

// Function to handle fetching and sending crypto data
async function handleCryptoData(id, ws) {
  const cacheKey = `crypto-${id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    ws.send(JSON.stringify(cachedData));
  } else {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}`
      );
      if (!response.ok) throw new Error("Failed to fetch crypto data.");

      const data = await response.json();
      cache.set(cacheKey, data);
      ws.send(JSON.stringify(data));
    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  }
}

// Function to handle fetching and sending market chart data
async function handleMarketChartData(id, days, ws) {
  const cacheKey = `marketChart-${id}-${days}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    ws.send(JSON.stringify(cachedData));
  } else {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
      );
      if (!response.ok) throw new Error("Failed to fetch market chart data.");

      const data = await response.json();
      cache.set(cacheKey, data);
      ws.send(JSON.stringify(data));
    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  }
}

// REST API to fetch crypto data
app.get("/api/crypto/:id", async (req, res) => {
  const { id } = req.params;
  const cacheKey = `crypto-${id}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}`
    );
    if (!response.ok) throw new Error("Failed to fetch crypto data.");

    const data = await response.json();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// REST API to fetch market chart data
app.get("/api/crypto/:id/market_chart", async (req, res) => {
  const { id } = req.params;
  const days = req.query.days || "365";
  const cacheKey = `marketChart-${id}-${days}`;
  const cachedData = cache.get(cacheKey);

  if (cachedData) {
    return res.json(cachedData);
  }

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`
    );
    if (!response.ok) throw new Error("Failed to fetch market chart data.");

    const data = await response.json();
    cache.set(cacheKey, data);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
server.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
