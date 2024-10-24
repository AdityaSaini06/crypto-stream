const express = require("express");
const node_cache = require("node-cache");
const cors = require("cors");
const WebSocket = require("ws");


// Initialize express, cache, and CORS
const app = express();
const cache = new node_cache({ stdTTL: 300 }); // Cache with TTL
app.use(cors());
const port = process.env.PORT || 5000;

// Create HTTP server and WebSocket
const server = require("http").createServer(app);
const wss = new WebSocket.Server({ server });

// Fetch data from CoinGecko with caching
async function fetchData(url, cacheKey) {
  const cachedData = cache.get(cacheKey);
  if (cachedData) return cachedData;

  try {
    const response = await fetch(url, { headers: { "x-api-key": process.env.API_KEY } });
    if (!response.ok) {
      const errorMessage = await response.text();
      console.error(`API Error: ${response.status} - ${errorMessage}`);
      throw new Error("Failed to fetch data.");
    }
    const data = await response.json();
    cache.set(cacheKey, data); // Cache the fetched data
    return data;
  } catch (error) {
    throw new Error(error.message);
  }
}

// WebSocket to handle crypto and chart data
wss.on("connection", (ws) => {
  console.log("New WebSocket connection.");

  ws.on("message", async (message) => {
    const { type, id, days } = JSON.parse(message);

    try {
      if (type === "cryptoData") {
        const data = await handleCryptoData(id);
        ws.send(JSON.stringify(data));
      } else if (type === "marketChartData") {
        const data = await handleMarketChartData(id, days || "365");
        ws.send(JSON.stringify(data));
      } else {
        ws.send(JSON.stringify({ error: "Invalid message type." }));
      }
    } catch (error) {
      ws.send(JSON.stringify({ error: error.message }));
    }
  });

  ws.on("close", () => console.log("WebSocket connection closed."));
});

// Fetch crypto data
async function handleCryptoData(id) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}`;
  return await fetchData(url, `crypto-${id}`);
}

// Fetch market chart data
async function handleMarketChartData(id, days) {
  const url = `https://api.coingecko.com/api/v3/coins/${id}/market_chart?vs_currency=usd&days=${days}`;
  return await fetchData(url, `marketChart-${id}-${days}`);
}

// REST endpoint for crypto data
app.get("/api/crypto/:id", async (req, res) => {
  try {
    const data = await handleCryptoData(req.params.id);
    res.json(data);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: error.message });
  }
});

// REST endpoint for market chart data
app.get("/api/crypto/:id/market_chart", async (req, res) => {
  const days = req.query.days || "365";
  try {
    const data = await handleMarketChartData(req.params.id, days);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
server.listen(port, () => console.log(`Server running on port ${port}`));
