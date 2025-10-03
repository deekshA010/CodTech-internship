# Real-time Chat (React + WebSockets)

A standalone, responsive real-time chat application powered by a Node.js WebSocket server and a React front-end served via Express.

## Features
- Persistent in-memory message history (last 100 messages)
- Broadcast to all connected clients
- Responsive UI with auto-scroll, timestamps, and username

## Project Structure
```
realtime-chat/
  package.json
  server.js
  public/
    index.html
    app.js
    styles.css
```

## Run Locally
1. Install dependencies
   ```bash
   npm install
   ```
2. Start the server
   ```bash
   npm start
   ```
3. Open the app
   - Navigate to http://localhost:8080 in your browser.
   - Open multiple tabs to see real-time messaging.

## Notes
- This app keeps the last 100 messages in memory only. Restarting the server clears history. For production, store messages in a database.
- If deploying, ensure your host supports Node.js long-running processes and WebSockets. The client connects to the same host/port as the page.
