import { createSlice } from '@reduxjs/toolkit';
import { io } from 'socket.io-client';

let socketInstance = null;

const initialState = {
    socket: null,
    isConnected: false,
};

const socketSlice = createSlice({
    name: 'socket',
    initialState,
    reducers: {
        connectSocket: (state, action) => {
            const { userId } = action.payload;

            if (!socketInstance && userId) {
                socketInstance = io('https://calmspace-ts-server.onrender.com/', {
                    query: { userId: userId },
                });

                state.socket = socketInstance;
                state.isConnected = true;
            }
        },
        disconnectSocket: (state) => {
            if (socketInstance) {
                socketInstance.disconnect();
                socketInstance = null;
                state.socket = null;
                state.isConnected = false;
            }
        },
    },
});

export const { connectSocket, disconnectSocket } = socketSlice.actions;

export default socketSlice.reducer;