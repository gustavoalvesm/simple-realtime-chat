import React, { useState, useEffect } from 'react';
import './App.css';
import io from 'socket.io-client';

const socket = io('http://localhost:3000');

function App() {

  const [username, setUsername] = useState("Visitor");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.on('chat-message', (data) => {
      setMessages([...messages, data]);
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    let data = { username, message };
    socket.emit('chat-message', data);
    setMessage("");
  }

  return (
    <main className="App">
      <section className="App__MessagesBox">
        {messages.map((msg, index) => {
          return (
            <div className="App__MessagesBox__Message" key={`msg${index}`}>
              <div className="App__MessagesBox__Message__Username">{msg.username}</div>
              <div className="App__MessagesBox__Message__Text">{msg.message}</div>
            </div>
          );
        })}
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
        />
      </form>
    </main>
  );
}

export default App;
