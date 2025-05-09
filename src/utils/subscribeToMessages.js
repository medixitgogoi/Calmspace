import { addMessage } from '../redux/chatSlice';
import { store } from '../redux/Store';

export const subscribeToMessages = (socket, id) => {

    console.log('entry');

    socket.on('newMessage', (newMessage) => {

        console.log('newMessage: ', newMessage);

        const isMessageSentFromSelectedUser = newMessage.senderId === id;
        if (!isMessageSentFromSelectedUser) return;

        store.dispatch(addMessage(newMessage));
    });
};