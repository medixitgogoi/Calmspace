import LottieView from 'lottie-react-native';
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView, Keyboard, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { primary } from '../utils/colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../redux/UserSlice';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Login = ({ navigation }) => {

    const userDetails = useSelector(state => state.user);
    // console.log('userDetails from login: ', userDetails);

    // const { connectSocket } = useSocket(); // pull in connectSocket

    const dispatch = useDispatch();

    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

    const [show, setShow] = useState(true);

    const [password, setPassword] = useState('');

    const [email, setEmail] = useState('');

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
            const submitData = {
                email: email,
                password: password,
            };

            // API Call using axios
            const response = await axios.post(`/auth/login`, submitData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('login response: ', response);
            console.log("councelor login data", response?.data)
            // Handle success response
            if (response?.data?.status_code === 200) {

                if (response?.data?.role === 'user') {
                    Toast.show({
                        type: 'success',
                        text1: 'Welcome Back! 🎉',
                        text2: 'User logged in successfully',
                        position: 'top',
                        topOffset: 40,
                    });

                    const userInfo = {
                        _id: response?.data?.user,
                        authToken: response?.data?.authToken,
                        profileStatus: response?.data?.profileStatus,
                    };

                    dispatch(addUser(userInfo));

                    await AsyncStorage.setItem('userDetails', JSON.stringify(userInfo));

                    if (response?.data?.profileStatus) {
                        navigation.navigate('Home')
                    } else {
                        navigation.navigate('Welcome')
                    }
                } else {
                    if (response?.data?.isVerified) {
                        Toast.show({
                            type: 'success',
                            text1: 'Welcome Back! 🎉',
                            text2: 'Counselor logged in successfully',
                            position: 'top',
                            topOffset: 40,
                        });

                        const userInfo = {
                            _id: response?.data?.user,
                            authToken: response?.data?.authToken,
                            role: 'counselor'
                        };

                        dispatch(addUser(userInfo));

                        await AsyncStorage.setItem('userDetails', JSON.stringify(userInfo));

                        navigation.navigate('Dashboard');

                    } else {
                        Toast.show({
                            type: 'error',
                            text1: 'Your verification is yet to complete',
                            text2: 'Please complete your verification and try again',
                            position: 'top',
                            topOffset: 40,
                        });
                    }
                }

            } else if (response?.data?.status_code === 405) {
                Toast.show({
                    type: 'error',
                    text1: response?.data?.error,
                    text2: 'Check your input and try again.',
                    position: 'top',
                    topOffset: 40,
                });
            } else if (response?.data?.status_code === 404) {
                Toast.show({
                    type: 'error',
                    text1: response?.data?.error,
                    text2: 'Check your input and try again.',
                    position: 'top',
                    topOffset: 40,
                });
            } else if (response?.data?.status_code === 500) {
                Toast.show({
                    type: 'error',
                    text1: response?.data?.error,
                    text2: 'Please try again.',
                    position: 'top',
                    topOffset: 40,
                });
            } else if (response?.data?.status_code === 401) {
                Toast.show({
                    type: 'error',
                    text1: response?.data?.error,
                    text2: 'Please try again.',
                    position: 'top',
                    topOffset: 40,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong.',
                text2: 'Please check your network connection and try again.',
                position: 'top',
                topOffset: 40,
            });
        } finally {
            setEmail('');
            setPassword('');

            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <KeyboardAvoidingView
                style={{ flex: 1, backgroundColor: '#fff' }}
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    {/* Background and Top Design */}
                    <View style={{ height: '50%', width: '100%', transition: 'height 0.3s ease-in-out' }}>

                        <Image source={require('../assets/background.png')} style={{ position: 'absolute', height: '170%', width: '100%' }} />

                        {/* Lights */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', position: 'absolute', top: 0, paddingHorizontal: 20 }}>
                            <Image source={require('../assets/light.png')} style={{ height: isKeyboardVisible ? responsiveHeight(20) : responsiveHeight(33), width: 140 }} resizeMode="contain" />
                            <Image source={require('../assets/light.png')} style={{ height: isKeyboardVisible ? responsiveHeight(10) : responsiveHeight(17), width: 100 }} resizeMode="contain" />
                        </View>

                        <View style={{ position: 'absolute', bottom: 0, width: '100%', alignSelf: 'center', flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                            <Text style={{ color: '#1f8dba', fontWeight: '500', fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-Medium', textAlign: 'center' }}>Start your journey to well-being today</Text>

                            <View style={{ width: 35, height: 35 }}>
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
                        <Text style={{ fontFamily: 'Poppins-Bold', fontSize: responsiveFontSize(2.8), textAlign: 'center', marginVertical: 30, color: '#000', textTransform: 'uppercase' }}>Login</Text>

                        {/* Email */}
                        <TextInput
                            placeholder="Email"
                            value={email}
                            placeholderTextColor={'grey'}
                            onChangeText={setEmail}
                            keyboardType='email-address'
                            selectionColor={primary}
                            style={{ height: 48, fontFamily: 'Poppins-SemiBold', backgroundColor: '#f3f3f3', borderColor: '#1f8dba', borderWidth: 1.5, fontWeight: '600', fontSize: responsiveFontSize(1.8), borderRadius: 12, paddingHorizontal: 15, marginBottom: 20, color: '#000' }}
                        />

                        {/* Password */}
                        <View style={{ flexDirection: 'row', height: 48, borderRadius: 15, alignItems: 'center', borderColor: '#1f8dba', borderWidth: 1.5, backgroundColor: '#f3f3f3', paddingHorizontal: 10, marginBottom: 4 }}>
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

                        {/* Forgot password */}
                        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')} style={{ marginBottom: 20, alignSelf: 'flex-end' }}>
                            <Text style={{ fontSize: responsiveFontSize(1.5), color: '#1f8dba', fontFamily: 'Poppins-Medium', textDecorationLine: 'underline' }}>Forgot password?</Text>
                        </TouchableOpacity>

                        {/* Login */}
                        <TouchableOpacity
                            onPress={handleLoginSubmit}
                            disabled={loading}
                            style={{ backgroundColor: '#1f8dba', height: 53, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                        >
                            {loading ? (
                                <ActivityIndicator size='large' color={'#fff'} />
                            ) : (
                                <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.6), fontWeight: '600', fontFamily: 'Poppins-Bold' }}>Login</Text>
                            )}
                        </TouchableOpacity>

                        {/* Sign up / Don't have an account */}
                        <View style={{ marginTop: 10, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', gap: 4 }}>
                            <Text style={{ color: '#bdbdbd', fontSize: responsiveFontSize(1.5), fontWeight: '500', fontFamily: 'Poppins-Medium' }}>Don't have an account?</Text>

                            <TouchableOpacity onPress={() => navigation.navigate('SignUp')} disabled={loading}>
                                <Text style={{ color: '#1f8dba', fontWeight: '600', fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(1.5) }}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaProvider>
    );
};

export default Login;