import { configureStore } from '@reduxjs/toolkit';
import userReducer from "./userSlice";
import socketUserReducer from './socket/userSocketSlice';

export const store = configureStore({
    reducer: {
        user: userReducer,
        userSocket: socketUserReducer
    },
})