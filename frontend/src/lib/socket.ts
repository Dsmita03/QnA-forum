// src/lib/socket.ts
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const SOCKET_URL ="http://localhost:5001";

/**
 * Initialize or get existing socket connection, and register user.
 * @param userId string
 * @returns socket instance
 */
export const initSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(SOCKET_URL, {
      withCredentials: true,
      // transports: ['websocket'], // optional for fallback
    });

    socket.on("connect", () => {
      console.log("🔌 Connected to Socket.IO server");
      socket?.emit("register", userId);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from socket");
    });
  }
  return socket;
};

export const getSocket = (): Socket | null => socket;

 
export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
