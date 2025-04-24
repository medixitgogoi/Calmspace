import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import React from 'react';

const useSocket = () => {

    const [socket, setSocket] = useState(null);
    const authUser = useSelector((state) => state.userSocket.user);

    const connectSocket = useCallback(() => {

        if (!authUser || socket?.connected) return;

        const newSocket = io('https://calmspace-ts-server.onrender.com/', {
        });

        newSocket.connect();
        setSocket(newSocket);

        return () => {
            newSocket.disconnect();
        };
    }, [authUser, socket]);

    useEffect(() => {
        connectSocket();
    }, [connectSocket]);

    return { socket };
};

export default useSocket;   