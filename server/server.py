import asyncio
import websockets
from urllib.parse import urlparse, parse_qs

HOST = "0.0.0.0"
PORT = 80

async def handler(websocket, origins):
    ip, port = websocket.remote_address
    username = parse_qs(urlparse(origins).query).get("username", ["Anonymous"])[0]
    print(f"{username}({ip}:{port}) connected")
    async for message in websocket:
        if message == "ping":
            print(f"{username}({ip}:{port}) ping")
            await websocket.send("pong")
        else:
            print(f"{username}({ip}:{port}): {message}")

async def main():
    server = await websockets.serve(handler, HOST, PORT)
    print(f"server listening {HOST}:{PORT}")

    await server.wait_closed()

if __name__ == "__main__":
    asyncio.run(main())