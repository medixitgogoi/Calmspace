import {
    View, Text, StatusBar, TouchableOpacity,
    TextInput, SectionList, KeyboardAvoidingView,
    Keyboard, Platform
} from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primary } from '../../utils/colors';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useChatStore } from '../../hooks/useChatStore';

const QuickBoostChat = ({ navigation, route }) => {
    const {
        messages,
        getMessages,
        sendMessage,
        subscribeToMessages,
        unsubscribeFromMessages,
        connectSocket,
    } = useChatStore();

    const sectionListRef = useRef(null);
    const { id, name } = route.params;
    const userDetails = useSelector((state) => state.user);
    const [message, setMessage] = useState('');
    const [bottomPadding, setBottomPadding] = useState(0);

    useEffect(() => {
        const init = async () => {
            await connectSocket();
            await getMessages(id);
            subscribeToMessages();
        };

        if (id) {
            init();
            return () => unsubscribeFromMessages();
        }
    }, [connectSocket, getMessages, id, subscribeToMessages, unsubscribeFromMessages]);

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

    const isSameDay = (d1, d2) => {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    };

    const formatDateHeader = (dateStr) => {
        const messageDate = new Date(dateStr);
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        if (isSameDay(messageDate, today)) return 'Today';
        if (isSameDay(messageDate, yesterday)) return 'Yesterday';

        return messageDate.toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleTimeString(undefined, {
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    const groupMessagesByDate = () => {
        const grouped = {};

        messages.forEach((msg) => {
            const key = formatDateHeader(msg.createdAt);
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push(msg);
        });

        return Object.keys(grouped).map((dateKey) => ({
            title: dateKey,
            data: grouped[dateKey],
        }));
    };

    const renderItem = ({ item }) => (
        <View style={{
            alignSelf: item.senderId === userDetails._id ? 'flex-end' : 'flex-start',
            backgroundColor: item.senderId === userDetails._id ? '#DCF8C6' : '#EAEAEA',
            marginVertical: 5,
            padding: 10,
            borderRadius: 10,
            maxWidth: '80%'
        }}>
            <Text style={{ color: '#000', fontSize: responsiveFontSize(1.8) }}>{item.text}</Text>
            <Text style={{ color: '#000', fontSize: responsiveFontSize(1.4), textAlign: 'right' }}>
                {formatTime(item.createdAt)}
            </Text>
        </View>
    );

    const renderSectionHeader = ({ section: { title } }) => (
        <View style={{ alignItems: 'center', marginVertical: 10 }}>
            <Text style={{
                fontSize: responsiveFontSize(1.8),
                color: '#666',
                fontFamily: 'Poppins-Medium',
            }}>
                {title}
            </Text>
        </View>
    );

    const handleSendMessage = async () => {
        if (!message.trim()) return;
        await sendMessage({ text: message, userId: id, image: null });
        setMessage('');
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
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingHorizontal: 5,
                        justifyContent: 'space-between',
                        marginBottom: 10
                    }}>
                        <TouchableOpacity onPress={() => navigation.goBack()} style={{
                            width: 35, height: 35, justifyContent: 'center', alignItems: 'center'
                        }}>
                            <Ionicons name="arrow-back" size={25} color={'#333'} />
                        </TouchableOpacity>

                        <Text style={{
                            fontSize: responsiveFontSize(2.3),
                            fontFamily: 'Poppins-SemiBold',
                            color: '#000',
                            paddingTop: 2
                        }}>{name}</Text>

                        <View style={{ width: 35, height: 35 }}></View>
                    </View>

                    {/* Chat List */}
                    <SectionList
                        ref={sectionListRef}
                        sections={groupMessagesByDate()}
                        renderItem={renderItem}
                        renderSectionHeader={renderSectionHeader}
                        keyExtractor={(item, index) => index.toString()}
                        contentContainerStyle={{ padding: 10, flexGrow: 1 }}
                    // onContentSizeChange={() => sectionListRef.current?.scrollToEnd({ animated: true })}
                    />

                    {/* Message Input */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 10,
                        borderTopWidth: 1,
                        borderColor: '#ccc'
                    }}>
                        <TextInput
                            value={message}
                            onChangeText={setMessage}
                            placeholder="Type a message"
                            placeholderTextColor={'#000'}
                            style={{ flex: 1, height: 47, elevation: 1, backgroundColor: '#F0F0F0', borderRadius: 50, paddingHorizontal: 20, fontSize: responsiveFontSize(1.9), color: '#000', fontFamily: 'Poppins-Medium' }}
                        />
                        <TouchableOpacity onPress={handleSendMessage} style={{ marginLeft: 10 }}>
                            <Ionicons name="send" size={24} color={primary} />
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default QuickBoostChat;
