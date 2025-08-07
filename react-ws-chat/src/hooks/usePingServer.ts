import { useEffect, useRef, useState } from "react";

const usePingServer = (serverAddress: string): boolean => {
  const ws = useRef<WebSocket | null>(null);
  const [canConnect, setCanConnect] = useState(false);
  const pingIntervalRef = useRef<number | null>(null);
  const pongTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    const connectAndPingServer = () => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current?.send("ping");
        startPongTimeout();
      } else {
        ws.current = new WebSocket(`ws://${serverAddress}`);

        ws.current.onopen = () => {
          ws.current?.send("ping");
          startPongTimeout();
        };

        ws.current.onmessage = (e) => {
          if (e.data === "pong") {
            clearPongTimeout();
            setCanConnect(true);
          }
        };

        ws.current.onerror = () => {
          clearPongTimeout();
          setCanConnect(false);
          ws.current?.close();
          ws.current = null;
        };

        ws.current.onclose = () => {
          setCanConnect(false);
          ws.current = null;
        };
      }
    };

    const startPongTimeout = () => {
      clearPongTimeout();
      pongTimeoutRef.current = window.setTimeout(() => {
        setCanConnect(false);
        ws.current?.close();
        ws.current = null;
      }, 5000);
    };

    const clearPongTimeout = () => {
      if (pongTimeoutRef.current !== null) {
        clearTimeout(pongTimeoutRef.current);
        pongTimeoutRef.current = null;
      }
    };

    connectAndPingServer();

    pingIntervalRef.current = setInterval(() => {
      connectAndPingServer();
    }, 15000);

    return () => {
      if (pingIntervalRef.current !== null) {
        clearInterval(pingIntervalRef.current);
      }

      ws.current?.close();
      ws.current = null;

      clearPongTimeout();
    };
  }, [serverAddress]);

  return canConnect;
};

export default usePingServer;
