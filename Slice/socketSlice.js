// src/store/socketSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  socketId: null, // Store socket ID
  connected: false, // Store connection status
  error: null, // Store error details in serializable format
};

const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    setSocketId: (state, action) => {
      state.socketId = action.payload; // Store only socket ID
    },
    setConnected: (state, action) => {
      state.connected = action.payload; // Store only connection status
    },
    setError: (state, action) => {
      // Store error details as an object with message, name, and stack
      state.error = action.payload; 
    },
    clearSocket: (state) => {
      state.socketId = null;
      state.connected = false;
      state.error = null;
    },
  },
});

export const { setSocketId, setConnected, setError, clearSocket } = socketSlice.actions;

export default socketSlice.reducer;
