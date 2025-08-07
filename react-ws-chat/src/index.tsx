import { useEffect, useRef, useState } from "react";
import usePingServer from "./hooks/usePingServer";
import useConnectServer from "./hooks/useConnectServer";

interface ChatComponentProps {
  serverAddress: string;
  username: string;
}

const ChatComponent: React.FC<ChatComponentProps> = ({
  serverAddress,
  username,
}) => {
  const canConnect = usePingServer(serverAddress);
  const { connected, messages, sendMessage, connect, disconnect } =
    useConnectServer(serverAddress, username, canConnect);

  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (message.trim() !== "") {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div
      style={{
        backgroundColor: "#f2f2f2",
        borderRadius: "8px",
        padding: "20px",
        width: connected ? "400px" : "fit-content",
        fontFamily: "Arial, sans-serif",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {!connected ? (
        <>
          <button
            onClick={connect}
            disabled={!canConnect}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              backgroundColor: canConnect ? "#0078D4" : "#a0a0a0",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: canConnect ? "pointer" : "not-allowed",
              transition: "background-color 0.3s ease",
            }}
          >
            {canConnect ? "Connect to Chat" : "Connecting..."}
          </button>
          {!canConnect && (
            <p
              style={{
                color: "red",
                fontSize: "14px",
                marginTop: "10px",
              }}
            >
              Sorry, the chat service is down. Try again later.
            </p>
          )}
        </>
      ) : (
        <>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "200px",
              overflowY: "auto",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              padding: "10px",
              marginBottom: "10px",
              width: "100%",
            }}
          >
            {messages.length === 0 ? (
              <div style={{ color: "#888", fontStyle: "italic" }}>
                No messages yet.
              </div>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  style={{
                    marginBottom: "6px",
                    padding: "6px 8px",
                    backgroundColor: "#f1f1f1",
                    borderRadius: "4px",
                    alignSelf: "flex-start",
                    maxWidth: "80%",
                  }}
                >
                  {msg}
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div
            style={{
              display: "flex",
              gap: "8px",
              width: "100%",
            }}
          >
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message..."
              style={{
                flex: 1,
                padding: "10px",
                border: "1px solid #ccc",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            />
            <button
              onClick={handleSend}
              style={{
                padding: "10px 16px",
                fontSize: "14px",
                backgroundColor: "#0078D4",
                color: "#fff",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>

          <button
            onClick={disconnect}
            style={{
              marginTop: "10px",
              padding: "6px 12px",
              fontSize: "12px",
              backgroundColor: "#d13438",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Disconnect
          </button>
        </>
      )}
    </div>
  );
};

export default ChatComponent;
