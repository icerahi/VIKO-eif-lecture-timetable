import { useState, useEffect } from "react";

function App() {
  const [messages, setMessages] = useState([]);
  const [ws, setWs] = useState(null);
  useEffect(() => {
    const connection = new WebSocket("ws://localhost:3000");

    connection.onopen = () => {
      console.log("Connected to ws!");
      setWs(connection);
    };

    connection.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMessages((prev) => [...prev, data]);
    };

    connection.onclose = () => console.log("Connection closed!");

    return () => {
      connection.close();
    };
  }, [messages]);

  ws && ws.send(JSON.stringify({ text: "HEllo from client!" }));
  return (
    <>
      <h1>Live Notificaation</h1>
      {messages.length != 0 &&
        messages.map((message, index) => <p key={index}>{message.text}</p>)}
    </>
  );
}

export default App;
