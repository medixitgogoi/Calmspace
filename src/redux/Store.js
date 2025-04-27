import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlice";
// import socketUserReducer from './socket/userSocketSlice';
import socketReducer from './socketSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        // userSocket: socketUserReducer,
        socket: socketReducer,
    },
})