import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {

  const [username, setUsername] = useState(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Initialize listeners
  useEffect(() => {
    socket.on('chat-message', (data) => {
      setMessages([...messages, data]);
    });
    socket.on('chat-history', (data) => {
      setMessages(data);
    });
  }, [messages]);

  // Request a history
  useEffect(() => {
    socket.emit('chat-history');
  }, []);

  // Send a new message
  const sendMessage = (e) => {
    e.preventDefault();
    let data = { username, message };
    socket.emit('chat-message', data);
    setMessage("");
  }

  // Process and render a message
  const renderMessage = (msg, index) => {
    const senderClass = msg.username === username ? 'App_MessagesBox_Message--sender' : '';
    return (
      <div className={`App_MessagesBox_Message ${senderClass}`} key={`msg${index}`}>
        <div className="App_MessagesBoxMessage_Username">{msg.username}</div>
        <div className="App_MessagesBoxMessage_Content">{msg.message}</div>
      </div>
    );
  }

  // Set a new username
  const defineUsername = (e) => {
    e.preventDefault();
    setUsername(e.target.username.value);
  }

  return (
    <main className="App">

      <section className="App__MessagesBox">
        {messages.map((msg, index) => renderMessage(msg, index))}
      </section>

      <form
        onSubmit={sendMessage}
        className="App__WriteBox"
      >
        <input
          placeholder="Press enter to send..."
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          required={true}
          autoFocus
        />
      </form>

      {
        !username &&
        <section className="App__PopupUsername">
          <h1 className="App_PopupUsername_Title">
            <span>Simple</span>Chat
          </h1>
          <p>Set a new username for you:</p>
          <form
            onSubmit={defineUsername}
            className="App__WriteBox"
          >
            <input
              name="username"
              placeholder="Username..."
              required={true}
              style={{ width: '310px' }}
              autoFocus
            />
          </form>
        </section>
      }

    </main>
  );
}

export default App;