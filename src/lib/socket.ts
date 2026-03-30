import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export const getSocket = () => {
  if (!socket) {
    // In this environment, the backend is on the same port 3000
    socket = io(window.location.origin, {
      transports: ['websocket'],
    });
  }
  return socket;
};

export const subscribeToPredictions = (callback: (data: any) => void) => {
  const s = getSocket();
  s.on('prediction:complete', callback);
  return () => s.off('prediction:complete', callback);
};

export const subscribeToQueue = (callback: (data: any) => void) => {
  const s = getSocket();
  s.on('queue:update', callback);
  return () => s.off('queue:update', callback);
};

export const subscribeToResults = (callback: (data: any) => void) => {
  const s = getSocket();
  s.on('result:verified', callback);
  return () => s.off('result:verified', callback);
};

export const subscribeToFormula = (callback: (data: any) => void) => {
  const s = getSocket();
  s.on('formula:patched', callback);
  return () => s.off('formula:patched', callback);
};
