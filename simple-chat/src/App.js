import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function generateUsername() {
  let date = new Date();
  return `user-${date.getHours()}${date.getMinutes()}${date.getSeconds()}`;
}

function App() {

  const [username] = useState(generateUsername());
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
    const senderClass = msg.username === username ? 'App__MessagesBox__Message--sender' : '';
    return (
      <div className={`App__MessagesBox__Message ${senderClass}`} key={`msg${index}`}>
        <div className="App__MessagesBox__Message__Username">{msg.username}</div>
        <div className="App__MessagesBox__Message__Content">{msg.message}</div>
      </div>
    );
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
    </main>
  );
}

export default App;
