import React, { createContext, useContext, useMemo } from 'react';
import { io } from 'socket.io-client';

// 1. Create Context
const SocketContext = createContext(null);

// 2. Custom hook to use socket in any component
export const useSocket = () => {
  return useContext(SocketContext);
};

// 3. Provider Component
const SocketProvider = ({ children }) => {
  // Replace with your actual Render server URL with HTTPS
  const socket = useMemo(() => {
    return io("https://video-peers-server.onrender.com", {
      transports: ['websocket'], // optional: ensures direct websocket usage
    });
  }, []);

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
