import { useState, useEffect, createContext } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { io, Socket } from "socket.io-client";
import PreLobby from "./PreLobby";
import PreGame from "./PreGame";
import { ServerToClientEvents, ClientToServerEvents } from "../../typings";

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io("http://localhost:3000");

export const SocketContext = createContext<Socket<ServerToClientEvents, ClientToServerEvents>>(socket);

function App() {
  // Top-level socket: only one connection for the whole app
  const [socket] = useState<Socket<ServerToClientEvents, ClientToServerEvents>>(() =>
    io("http://localhost:3000")
  );

  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<PreLobby />} />
          <Route path="/game/:roomId" element={<PreGame />} />
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
