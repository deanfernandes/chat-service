import { useRef, useState } from "react";
import usePingServer from "./hooks/usePingServer";

interface ChatComponentProps {
  serverAddress: string;
  username: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  serverAddress,
  username,
}) => {
  const canConnect = usePingServer(serverAddress);
  const [connected, setConnected] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  const handleConnect = () => {
    ws.current = new WebSocket(`ws://${serverAddress}?username=${username}`);

    ws.current.onopen = () => {
      setConnected(true);
    };

    ws.current.onerror = () => {
      ws.current?.close();
      ws.current = null;
    };

    ws.current.onclose = () => {
      setConnected(false);
    };
  };

  const handleSend = () => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(message);

      setMessages((prev) => [...prev, username + ": " + message]);

      setMessage("");
    }
  };

  return (
    <div style={{ backgroundColor: "lightgray" }}>
      {!connected ? (
        <>
          <button disabled={!canConnect} onClick={handleConnect}>
            Connect
          </button>
          {!canConnect && <p>Sorry, chat service is down. Try again later.</p>}
        </>
      ) : (
        <>
          <div
            style={{
              maxHeight: "100px",
              overflowY: "auto",
              textAlign: "left",
            }}
          >
            {messages.map((msg, index) => (
              <div key={index}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
          />
          <button onClick={handleSend}>Send</button>
        </>
      )}
    </div>
  );
};

export default ChatComponent;
