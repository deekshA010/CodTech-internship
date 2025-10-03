// Real-time Chat Server (Express + ws)
// Usage: npm install && npm start

const express = require('express');
const http = require('http');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;

// In-memory message history
const MAX_HISTORY = 100;
const messageHistory = [];

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

function broadcast(obj, except) {
  const data = JSON.stringify(obj);
  wss.clients.forEach((client) => {
    if (client !== except && client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

wss.on('connection', (ws) => {
  // Send recent history
  ws.send(JSON.stringify({ type: 'history', payload: messageHistory }));

  ws.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch {
      return;
    }

    if (data.type === 'message') {
      const entry = {
        id: Date.now() + Math.random().toString(36).slice(2),
        user: String(data.user || 'Anonymous').slice(0, 32),
        text: String(data.text || '').slice(0, 2000),
        ts: Date.now(),
      };
      messageHistory.push(entry);
      if (messageHistory.length > MAX_HISTORY) messageHistory.shift();

      broadcast({ type: 'message', payload: entry });
    }
  });
});

server.listen(PORT, () => {
  console.log(`Chat app ready on http://localhost:${PORT}`);
  console.log(`WebSocket listening on ws://localhost:${PORT}`);
});
