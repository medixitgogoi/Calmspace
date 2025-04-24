import { View, Text, StatusBar, TouchableOpacity, TextInput, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useState, useRef, useEffect } from 'react';
import { background, primary, secondary } from '../utils/colors';

const AiChat = ({ navigation }) => {

  const [messages, setMessages] = useState([
    { id: '1', text: 'Hi there! How can I help you today?', type: 'bot' }
  ]);

  const [input, setInput] = useState('');

  const flatListRef = useRef(null);

  const handleSend = () => {
    if (input.trim() === '') return

    const newMessage = { id: Date.now().toString(), text: input, type: 'user' }
    setMessages(prev => [...prev, newMessage])

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now().toString(), text: "I'm Luna, your AI assistant 🤖", type: 'bot' }])
    }, 800)

    setInput('')
  };

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToEnd({ animated: true })
    }
  }, [messages]);

  const renderItem = ({ item }) => (
    <View style={{
      alignSelf: item.type === 'user' ? 'flex-end' : 'flex-start',
      backgroundColor: item.type === 'user' ? '#DCF8C6' : '#F1F0F0',
      borderRadius: 16,
      padding: 10,
      marginVertical: 4,
      marginHorizontal: 10,
      maxWidth: '80%'
    }}>
      <Text style={{ fontSize: responsiveFontSize(1.9), color: '#000', fontFamily: 'Poppins-Medium' }}>{item.text}</Text>
    </View>
  );

  return (
    <SafeAreaProvider>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : 'height'} keyboardVerticalOffset={0}>
        <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
          <StatusBar animated={true} barStyle={'dark-content'} hidden={false} />

          {/* Header */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'space-between', marginBottom: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
              <Ionicons name="arrow-back" size={27} color={'#333'} />
            </TouchableOpacity>
            <Text style={{ fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>Chat with Luna</Text>
            <View style={{ width: 35, height: 35 }}></View>
          </View>

          {/* Chat messages */}
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={item => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 70 }}
            showsVerticalScrollIndicator={false}
          />

          {/* Input bar */}
          <View style={{ flexDirection: 'row', alignItems: 'center', padding: 10, borderTopWidth: 0.5, borderTopColor: '#ccc', backgroundColor: '#fff' }}>
            <TextInput
              placeholder="Type your message ..."
              value={input}
              onChangeText={setInput}
              style={{ flex: 1, height: 47, elevation: 1, backgroundColor: '#F0F0F0', borderRadius: 50, paddingHorizontal: 20, fontSize: responsiveFontSize(1.9), color: '#000', fontFamily: 'Poppins-Medium' }}
              placeholderTextColor="#777"
            />

            <TouchableOpacity onPress={handleSend} style={{ marginLeft: 10 }}>
              <Ionicons name="send" size={24} color={primary} />
            </TouchableOpacity>
          </View>

        </SafeAreaView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  )
}

export default AiChat;