import { io } from 'socket.io-client';
import { setSocketId, setConnected, setError } from '../../Slice/socketSlice';
import { useDispatch } from 'react-redux';
import { useRef, useEffect } from 'react';

// Socket service for managing connection
const useSocket = () => {
  const dispatch = useDispatch();
  const socket = useRef(null);

  useEffect(() => {
    // Check if the socket is already connected
    if (!socket.current) {
      socket.current = io('http://192.168.4.214:3000', {
        transports: ['websocket'],
      });

      socket.current.on('connect', () => {
        dispatch(setSocketId(socket.current.id));
        dispatch(setConnected(true));
        console.log('Socket connected with ID:', socket.current.id);
      });

      socket.current.on('connect_error', (error) => {
        // Dispatching error as a serializable object
        dispatch(setError({
          message: error.message,
          name: error.name,
          stack: error.stack,
        }));
        console.error('Socket connection failed:', error);
      });

      socket.current.on('disconnect', () => {
        dispatch(setConnected(false));
        console.log('Socket disconnected');
      });
    }

    // Cleanup on component unmount
    return () => {
      if (socket.current) {
        socket.current.disconnect();
        console.log('Socket disconnected on unmount');
      }
    };
  }, []);  // Empty dependency array ensures this effect only runs once (on mount)

  // Function to emit events
  const emit = (event, data) => {
    if (socket.current) {
      socket.current.emit(event, data);
    } else {
      console.error('Socket not initialized');
    }
  };

  // Function to listen for events
  const on = (event, callback) => {
    if (socket.current) {
      socket.current.on(event, callback);
    } else {
      console.error('Socket not initialized');
    }
  };

  // Function to remove event listeners
  const off = (event, callback) => {
    if (socket.current) {
      socket.current.off(event, callback);
    } else {
      console.error('Socket not initialized');
    }
  };

  // Return socket methods for use in your components
  return { emit, on, off, socket: socket.current };
};

export default useSocket;
