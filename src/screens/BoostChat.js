import { View, Text, StatusBar, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primary } from '../utils/colors';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { subscribeToMessages } from '../utils/subscribeToMessages';

const BoostChat = ({ navigation, route }) => {

    // const socket = useSelector((state) => state.socket.socket);
    // console.log('socket: ', socket);

    const socketmessages = useSelector((state) => state.chat.messages);
    // console.log('messages from socket: ', socketmessages);

    const dispatch = useDispatch();

    const { id } = route.params;

    const userDetails = useSelector(state => state.user);

    const authToken = userDetails?.authToken;

    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);

    const [bottomPadding, setBottomPadding] = useState(0);

    const socket = useSelector((state) => state.socket.socket);
    // const messages = useSelector((state) => state.chat.messages);

    // keyboard adjustment
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', (e) => {
            setBottomPadding(e.endCoordinates.height);
        });

        const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
            setBottomPadding(0);
        });

        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    // Send Message
    const sendMessage = async () => {

        try {
            // setLoading(true);

            // Data object as per the API requirement
            const data = {
                text: message,
            };

            // API Call using axios
            const response = await axios.post(`/message/send/${id}`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken,
                }
            });

            console.log('send message response: ', response);

        } catch (error) {
            console.log('error: ', error);
        } finally {
            // setLoading(false);
        }
    };

    const renderItem = ({ item }) => (
        <View style={{
            alignSelf: item.sender === 'user' ? 'flex-end' : 'flex-start',
            backgroundColor: item.sender === 'user' ? '#DCF8C6' : '#EAEAEA',
            marginVertical: 5,
            padding: 10,
            borderRadius: 10,
            maxWidth: '80%'
        }}>
            <Text style={{ color: '#000', fontSize: responsiveFontSize(1.8) }}>{item.text}</Text>
        </View>
    );

    // Get Message
    const getMessage = async () => {
        try {
            const response = await axios.get(`/message/getmessage/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken,
                },
            });

            if (response?.status === 200) {
                subscribeToMessages(socket, id);
            }

            console.log('get message response: ', response);

        } catch (error) {
            console.log('error: ', error);
        }
    };

    useEffect(() => {

        getMessage();

    }, [dispatch]);

    // useEffect(() => {
    //     getMessage();

    //     if (socket.connected) {
    //         subscribeToMessages(socket, id);
    //     }
    // }, [dispatch, socket, id, getMessage, subscribeToMessages]);

    // useEffect(() => {
    //     getMessage();

    //     subscribeToMessages();

    // }, [dispatch, socket, id, getMessage, subscribeToMessages])

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* StatusBar */}
                <StatusBar
                    animated={true}
                    barStyle={'dark-content'}
                    hidden={false}
                />

                <KeyboardAvoidingView
                    style={{ flex: 1, paddingBottom: bottomPadding }}
                    behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                >
                    {/* Header */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, justifyContent: 'space-between', marginBottom: 10 }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                            <Ionicons name="arrow-back" size={25} color={'#333'} />
                        </TouchableOpacity>

                        <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>Chat</Text>

                        <View style={{ width: 35, height: 35 }}></View>
                    </View>

                    {/* Chat Area */}
                    <FlatList
                        data={messages}
                        renderItem={renderItem}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                        inverted
                    />

                    {/* Message Input */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 1, borderColor: '#ccc' }}>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message"
                            placeholderTextColor={'#000'}
                            style={{
                                flex: 1,
                                backgroundColor: '#f1f1f1',
                                borderRadius: 20,
                                paddingHorizontal: 15,
                                fontSize: responsiveFontSize(1.8),
                                fontFamily: 'Poppins-Medium',
                            }}
                        />

                        {/* Send button */}
                        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
                            <Ionicons name="send" size={24} color={primary} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default BoostChat;