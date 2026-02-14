const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const { Kafka } = require("kafkajs");
const client = require("prom-client");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
});

// Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();
const loadTestStatus = new client.Gauge({
  name: "load_test_running",
  help: "Is a load test currently running",
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

// Kafka Integration
const kafka = new Kafka({
  clientId: "orchestrator",
  brokers: ["localhost:9092"],
});
const producer = kafka.producer();

app.post("/api/start-test", async (req, res) => {
  // Logic to trigger JMeter/Locust or internal simulation
  try {
    loadTestStatus.set(1);
    await producer.connect();
    await producer.send({
      topic: "test-events",
      messages: [
        { value: JSON.stringify({ type: "TEST_STARTED", timestamp: Date.now() }) },
      ],
    });
    res.json({ status: "Test Started" });
  } catch (err) {
    console.error("Kafka Error:", err);
    res.status(500).json({ status: "Error connection to Kafka", error: err.message });
  }
});

app.post("/api/stop-test", (req, res) => {
  loadTestStatus.set(0);
  res.json({ status: "Test Stopped" });
});

// WebSocket for live updates
io.on("connection", (socket) => {
  console.log("Client connected for live metrics");
  const interval = setInterval(() => {
    socket.emit("metrics_update", {
      throughput: Math.floor(Math.random() * 1000),
      latency: Math.floor(Math.random() * 100),
      timestamp: Date.now(),
    });
  }, 1000);

  socket.on("disconnect", () => clearInterval(interval));
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`Orchestrator running on port ${PORT}`);
});
