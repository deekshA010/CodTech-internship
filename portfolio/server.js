// Simple WebSocket chat server using ws
// Run: npm install && npm start

const http = require('http');
const WebSocket = require('ws');

const PORT = process.env.PORT || 8080;

// In-memory message history (last 100 messages)
const messageHistory = [];
const MAX_HISTORY = 100;

const server = http.createServer();
const wss = new WebSocket.Server({ server });

function broadcast(data, except) {
  const msg = typeof data === 'string' ? data : JSON.stringify(data);
  wss.clients.forEach(client => {
    if (client !== except && client.readyState === WebSocket.OPEN) {
      client.send(msg);
    }
  });
}

wss.on('connection', (ws) => {
  // Send recent history to the new client
  ws.send(JSON.stringify({ type: 'history', payload: messageHistory }));

  ws.on('message', (raw) => {
    let data;
    try {
      data = JSON.parse(raw);
    } catch (e) {
      return; // ignore non-JSON
    }

    if (data && data.type === 'message') {
      const entry = {
        id: Date.now() + Math.random().toString(36).slice(2),
        user: String(data.user || 'Anonymous').slice(0, 32),
        text: String(data.text || '').slice(0, 2000),
        ts: Date.now(),
      };
      messageHistory.push(entry);
      if (messageHistory.length > MAX_HISTORY) messageHistory.shift();

      const outbound = { type: 'message', payload: entry };
      broadcast(outbound);
    }
  });

  ws.on('close', () => {
    // No-op for now
  });
});

server.listen(PORT, () => {
  console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});
