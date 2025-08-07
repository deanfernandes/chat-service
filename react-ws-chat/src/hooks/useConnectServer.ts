import { useEffect, useRef, useState } from "react";

interface UseConnectServerReturn {
  connected: boolean;
  messages: string[];
  sendMessage: (message: string) => void;
  connect: () => void;
  disconnect: () => void;
  clearMessages: () => void;
}

const useConnectServer = (
  serverAddress: string,
  username: string,
  canConnect: boolean
): UseConnectServerReturn => {
  const ws = useRef<WebSocket | null>(null);
  const [connected, setConnected] = useState<boolean>(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    if (!canConnect && connected) {
      disconnect();
    }
  }, [canConnect, connected]);

  const connect = () => {
    if (!canConnect) return;

    if (ws.current?.readyState === WebSocket.OPEN) return;

    ws.current = new WebSocket(`ws://${serverAddress}?username=${username}`);

    ws.current.onopen = () => {
      setConnected(true);
    };

    ws.current.onerror = () => {
      ws.current?.close();
      ws.current = null;
      setConnected(false);
    };

    ws.current.onclose = () => {
      setConnected(false);
      ws.current = null;
    };

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };
  };

  const disconnect = () => {
    ws.current?.close();
    ws.current = null;
    setConnected(false);
    setMessages([]);
  };

  const sendMessage = (message: string) => {
    if (ws.current?.readyState === WebSocket.OPEN && message.trim() !== "") {
      ws.current.send(message);
      setMessages((prev) => [...prev, message]);
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [serverAddress, username]);

  return {
    connected,
    messages,
    sendMessage,
    connect,
    disconnect,
    clearMessages,
  };
};

export default useConnectServer;
