import { create } from "zustand";
import { io } from "socket.io-client";

const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5002" : "/";

export const useAuthStore = create((set, get) => ({

    socket: null,

    connectSocket: () => {

        // const { authUser } = get();

        // if (!authUser || get().socket?.connected) return;

        const socket = io(BASE_URL, {
            query: {
                userId: authUser._id,
            },
        });

        socket.connect();

        set({ socket: socket });

        // socket.on("getOnlineUsers", (userIds) => {
        //     set({ onlineUsers: userIds });
        // });
    },


    disconnectSocket: () => {
        if (get().socket?.connected) get().socket.disconnect();
    },

}))

