function useLocalStorage(key, initialValue) {
  const [value, setValue] = React.useState(() => {
    const v = localStorage.getItem(key);
    return v !== null ? JSON.parse(v) : initialValue;
  });
  React.useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function ChatApp() {
  const [username, setUsername] = useLocalStorage('chat_username', 'Guest');
  const [text, setText] = React.useState('');
  const [messages, setMessages] = React.useState([]);
  const [status, setStatus] = React.useState('connecting');
  const wsRef = React.useRef(null);
  const listRef = React.useRef(null);

  React.useEffect(() => {
    let wsUrl;
    if (location.protocol === 'file:' || !location.hostname) {
      wsUrl = 'ws://localhost:8080';
    } else if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
      wsUrl = `ws://localhost:${location.port || 8080}`;
    } else {
      wsUrl = `wss://${location.hostname}`; // adjust for production as needed
    }

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => setStatus('online');
    ws.onclose = () => setStatus('offline');
    ws.onerror = () => setStatus('error');

    ws.onmessage = (evt) => {
      try {
        const data = JSON.parse(evt.data);
        if (data.type === 'history') {
          setMessages(data.payload || []);
        } else if (data.type === 'message') {
          setMessages(prev => [...prev, data.payload]);
        }
      } catch (e) {
        // ignore non-JSON
      }
    };

    return () => {
      ws.close();
    };
  }, []);

  React.useEffect(() => {
    // auto scroll to bottom when messages change
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  function sendMessage(e) {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) return;
    wsRef.current.send(JSON.stringify({ type: 'message', user: username || 'Guest', text: trimmed }));
    setText('');
  }

  return (
    <div className="chat-wrap">
      <header className="chat-header">
        <a className="back" href="../index.html">← Back</a>
        <h1>Real-time Chat</h1>
        <div className={`status ${status}`}>{status}</div>
      </header>

      <section className="identity">
        <label>
          <span>Display name</span>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={32}
            placeholder="Your name"
          />
        </label>
      </section>

      <main className="chat-main">
        <ul className="messages" ref={listRef}>
          {messages.map(m => (
            <li className="message" key={m.id}>
              <span className="meta">
                <strong className="user">{m.user}</strong>
                <span className="time">{new Date(m.ts).toLocaleTimeString()}</span>
              </span>
              <span className="text">{m.text}</span>
            </li>
          ))}
        </ul>
      </main>

      <form className="composer" onSubmit={sendMessage}>
        <input
          className="input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message..."
          maxLength={2000}
        />
        <button className="send" type="submit">Send</button>
      </form>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ChatApp />);
