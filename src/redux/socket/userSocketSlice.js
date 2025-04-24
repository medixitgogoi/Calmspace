import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    authStatus: false,
};

export const userSocketSlice = createSlice({
    name: 'userSocket',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        logoutUser: (state) => {
            state.user = null;
            state.authStatus = false;
        },
        setAuthStatus: (state, action) => {
            state.authStatus = action.payload;
        },
    },
});

export const {
    setUser,
    logoutUser,
    setAuthStatus,
} = userSocketSlice.actions;

export default userSocketSlice.reducer;