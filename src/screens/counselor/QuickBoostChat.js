import { View, Text, StatusBar, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Keyboard, Platform } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primary } from '../../utils/colors';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { subscribeToMessages } from '../../utils/subscribeToMessages';

const QuickBoostChat = ({ navigation, route }) => {

    const { id } = route.params;

    const userDetails = useSelector(state => state.user);

    const authToken = userDetails?.authToken;

    const [message, setMessage] = useState('');
    // const [messages, setMessages] = useState([]);

    const [bottomPadding, setBottomPadding] = useState(0);

    const dispatch = useDispatch();
    const selectedUser = useSelector((state) => state.chat.selectedUser);
    const socket = useSelector((state) => state.chat.socket);
    const messages = useSelector((state) => state.chat.messages);

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

    const getMessage = async () => {
        try {
            const response = await axios.get(`/message/getmessage/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: authToken,
                },
            });

            console.log('get message response: ', response);


        } catch (error) {
            console.log('error: ', error);
        }
    };

    useEffect(() => {
        getMessage();

        if (socket) {
            subscribeToMessages(socket, id);
        }

        // return () => {
        //     dispatch(unsubscribeFromMessages());
        // };
    }, [dispatch, selectedUser, socket]);

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

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                {/* StatusBar */}
                <StatusBar animated={true} barStyle={'dark-content'} hidden={false} />

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

                        {/* send button */}
                        <TouchableOpacity onPress={sendMessage} style={{ marginLeft: 10 }}>
                            <Ionicons name="send" size={24} color={primary} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default QuickBoostChat;