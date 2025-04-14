import LottieView from 'lottie-react-native';
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard, ActivityIndicator, StatusBar } from 'react-native';
import { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { primary } from '../utils/colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useDispatch } from 'react-redux';
import { addUser } from '../redux/UserSlice';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Login = ({ navigation }) => {

    const dispatch = useDispatch()

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const [show, setShow] = useState(true);

    const [password, setPassword] = useState('');
    // const [isPasswordFocused, setIsPasswordFocused] = useState(false);

    const [email, setEmail] = useState('');
    // const [isMobileFocused, setIsMobileFocused] = useState(false);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const keyboardShow = Keyboard.addListener('keyboardDidShow', () => {
            setIsKeyboardVisible(true);
        });
        const keyboardHide = Keyboard.addListener('keyboardDidHide', () => {
            setIsKeyboardVisible(false);
        });

        return () => {
            keyboardShow.remove();
            keyboardHide.remove();
        };
    }, []);

    const handleLoginSubmit = async () => {
        // Ensure all fields are filled
        if (!email || !password) {
            Toast.show({
                type: 'error',
                text1: 'Missing Information',
                text2: 'All fields are required',
                position: 'top',
                topOffset: 40,
            });

            return;
        }

        try {
            setLoading(true);

            // Data object as per the API requirement
            const data = {
                email: email,
                password: password,
            };

            // API Call using axios
            const response = await axios.post(`/auth/login`, data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('login response: ', response);

            // Handle success response
            if (response?.data?.status_code === 201) {

                Toast.show({
                    type: 'success',
                    text1: 'Welcome Back! 🎉',
                    text2: 'User logged in successfully',
                    position: 'top',
                    topOffset: 40,
                });

                const userInfo = {
                    authToken: response?.data?.authToken,
                    profileStatus: response?.data?.profileStatus
                };

                dispatch(addUser(userInfo));
                await AsyncStorage.setItem('userDetails', JSON.stringify(userInfo));

                if (response?.data?.profileStatus) {
                    navigation.navigate('Home')
                } else {
                    navigation.navigate('Welcome')
                }

                setEmail('');
                setPassword('');

            } else if (response?.data?.status_code === 405) {
                Toast.show({
                    type: 'error',
                    text1: response?.data?.errors,
                    text2: 'Check your input and try again.',
                    position: 'top',
                    topOffset: 40,
                });
            } else if (response?.data?.status_code === 404) {
                Toast.show({
                    type: 'error',
                    text1: response?.data?.errors,
                    text2: 'Check your input and try again.',
                    position: 'top',
                    topOffset: 40,
                });
            } else if (response?.data?.status_code === 500) {
                Toast.show({
                    type: 'error',
                    text1: response?.data?.errors,
                    text2: 'Please try again.',
                    position: 'top',
                    topOffset: 40,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please try again.',
                position: 'top',
                topOffset: 40,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#fff' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <StatusBar animated={true} hidden={true} />

                    {/* Background and Top Design */}
                    <View style={{ height: '50%', width: '100%', transition: 'height 0.3s ease-in-out' }}>

                        <Image source={require('../assets/background.png')} style={{ position: 'absolute', height: '170%', width: '100%' }} />

                        {/* Lights */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', position: 'absolute', top: 0, paddingHorizontal: 20 }}>
                            <Image source={require('../assets/light.png')} style={{ height: isKeyboardVisible ? 190 : 290, width: 140 }} resizeMode="contain" />
                            <Image source={require('../assets/light.png')} style={{ height: isKeyboardVisible ? 130 : 180, width: 100 }} resizeMode="contain" />
                        </View>

                        <View style={{ position: 'absolute', bottom: 0, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                            <Text style={{ color: '#1f8dba', fontWeight: '500', fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', textAlign: 'center' }}>Start your journey to well-being today</Text>

                            <View style={{ width: 40, height: 40 }}>
                                <LottieView source={require('../assets/animations/login.json')} autoPlay loop style={{ width: '100%', height: '100%' }} />
                            </View>
                        </View>
                    </View>

                    {/* Login Form with ScrollView */}
                    <ScrollView
                        style={{ width: '100%', height: '45%' }}
                        contentContainerStyle={{ paddingHorizontal: 30, paddingBottom: 20 }}
                        keyboardShouldPersistTaps="handled"
                        showsVerticalScrollIndicator={false}
                    >
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: responsiveFontSize(3), textAlign: 'center', marginVertical: 40, color: '#000', textTransform: 'uppercase' }}>Login</Text>

                        {/* Email */}
                        <TextInput
                            placeholder="Email"
                            value={email}
                            placeholderTextColor={'grey'}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            selectionColor={primary}
                            style={{ height: 50, fontFamily: 'Poppins-SemiBold', backgroundColor: '#f3f3f3', borderColor: '#1f8dba', borderWidth: 1.5, fontWeight: '600', fontSize: responsiveFontSize(1.8), borderRadius: 15, paddingHorizontal: 15, marginBottom: 20, color: '#000' }}
                        />

                        {/* Password */}
                        <View style={{ flexDirection: 'row', height: 50, borderRadius: 15, alignItems: 'center', borderColor: '#1f8dba', borderWidth: 1.5, backgroundColor: '#f3f3f3', borderRadius: 15, paddingHorizontal: 10, marginBottom: 20 }}>
                            <TextInput
                                placeholder="Password"
                                value={password}
                                secureTextEntry={show}
                                onChangeText={setPassword}
                                selectionColor={primary}
                                placeholderTextColor={'grey'}
                                style={{ fontFamily: 'Poppins-SemiBold', fontWeight: '600', color: '#000', fontSize: responsiveFontSize(1.8), width: '100%' }}
                            />

                            <View style={{ position: 'absolute', right: 5, top: 14 }}>
                                <Feather
                                    name={show ? 'eye-off' : 'eye'}
                                    onPress={() => setShow(!show)}
                                    style={{
                                        color: '#000',
                                        fontSize: responsiveFontSize(2),
                                        width: 28,
                                        height: 28,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                />
                            </View>
                        </View>

                        {/* Login */}
                        <TouchableOpacity
                            onPress={handleLoginSubmit}
                            style={{ backgroundColor: '#1f8dba', height: 58, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                        >
                            {loading ? (
                                <ActivityIndicator size='large' color={'#fff'} />
                            ) : (
                                <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.6), fontWeight: '600', fontFamily: 'Poppins-Bold' }}>Login</Text>
                            )}
                        </TouchableOpacity>

                        {/* Sign up / Don't have an account */}
                        <TouchableOpacity style={{ marginTop: 15, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 5 }}>
                            <Text style={{ color: '#bdbdbd', fontSize: responsiveFontSize(1.6), fontWeight: '500', fontFamily: 'Poppins-Medium' }}>Don't have an account?</Text>

                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                                <Text style={{ color: '#1f8dba', fontWeight: '600', fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(1.7) }}>Sign Up</Text>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </ScrollView>
                </SafeAreaView>
            </KeyboardAvoidingView>
        </SafeAreaProvider>
    );
};

export default Login;