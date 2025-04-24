import { View, Text, StatusBar, TouchableOpacity, TextInput, Dimensions, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LottieView from 'lottie-react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import Toast from 'react-native-toast-message';
import axios from 'axios';

const { width: screenWidth } = Dimensions.get('window');

const ForgotPassword = ({ navigation }) => {

    const [email, setEmail] = useState('');
    const slideAnim = useRef(new Animated.Value(0)).current;

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const inputs = useRef([]);

    const [timer, setTimer] = useState(30);
    const [canResend, setCanResend] = useState(false);

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [loading, setLoading] = useState(false);

    const [tempToken, setTempToken] = useState(null);

    const resendOtpHandler = () => {
        console.log('Resending OTP to:', email);
        setTimer(30);
        setCanResend(false);
        // Add resend API logic here
    };

    const nextHandler = async () => {
        if (!email) {
            Toast.show({
                type: 'error',
                text1: 'Incomplete information',
                text2: 'Please enter email and then proceed',
                position: 'top',
                topOffset: 40,
            });

            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`/auth/send-otp`,
                {
                    email: email
                }
            );

            console.log('otp send response: ', response);

            if (response?.data?.status_code === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: 40,
                });

                Animated.timing(slideAnim, {
                    toValue: -screenWidth,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {

                    setTimer(30);
                    setCanResend(false);

                    const interval = setInterval(() => {
                        setTimer(prev => {
                            if (prev <= 1) {
                                clearInterval(interval);
                                setCanResend(true);
                                return 0;
                            }
                            return prev - 1;
                        });
                    }, 1000);
                });

            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Invalid Information',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: 40,
                });
            }

        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please check your internet connection and try again',
                position: 'top',
                topOffset: 40,
            });
        } finally {
            setLoading(false);
        }
    };

    const handleOtpChange = (text, index) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputs.current[index + 1]?.focus();
        } else if (!text && index > 0) {
            inputs.current[index - 1]?.focus();
        }
    };

    const verifyOtpHandler = async () => {

        setLoading(true);

        try {
            const otpCode = otp.join('');

            const response = await axios.post(`/auth/verify-otp`, {
                email: email,
                otp: otpCode,
            });

            console.log('otp verify: ', response);

            if (response?.data?.status_code === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: 40,
                });

                setTempToken(response?.data?.tempToken);

                Animated.timing(slideAnim, {
                    toValue: -screenWidth * 2,
                    duration: 300,
                    useNativeDriver: true,
                }).start();

            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Invalid Information',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: 40,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please check your internet connection and try again',
                position: 'top',
                topOffset: 40,
            });
        } finally {
            setLoading(false);
        }
    };

    const changePasswordHandler = async () => {
        if (password !== confirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Passwords do not match',
                text2: 'Please make sure both fields have the same password.',
                position: 'top',
                topOffset: 40,
            });

            return;
        }

        setLoading(true);

        try {

            const response = await axios.post(
                "/auth/reset-password",
                {
                    resetpassword: password
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: tempToken,
                    },
                }
            );

            console.log('password response: ', response);

            if (response?.data?.status_code === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Success',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: 40,
                });

                navigation.navigate('Login');
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Invalid Information',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: 40,
                });
            }
            
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Something went wrong',
                text2: 'Please check your internet connection and try again',
                position: 'top',
                topOffset: 40,
            });
        } finally {
            setLoading(false);
        }
    }

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#ecf9f9', paddingHorizontal: 0 }}>
                <StatusBar hidden={false} barStyle='dark-content' />

                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 3, marginBottom: 30, alignSelf: 'flex-start', width: 35, height: 30, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Ionicons name="arrow-back" size={25} color={'#000'} />
                </TouchableOpacity>

                <View style={{ width: 180, height: 180, alignSelf: 'center', marginBottom: 40 }}>
                    <LottieView source={require('../assets/animations/password.json')} autoPlay loop style={{ height: '100%', width: '100%' }} />
                </View>

                <Animated.View style={{ flexDirection: 'row', width: screenWidth * 3, transform: [{ translateX: slideAnim }] }}>
                    {/* Slide 1: Email */}
                    <View style={{ width: screenWidth, paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: responsiveFontSize(2.4), fontFamily: 'Poppins-SemiBold', color: '#000', marginBottom: 8, marginHorizontal: 5 }}>Forgot your password?</Text>

                        <Text style={{ fontSize: responsiveFontSize(1.6), fontFamily: 'Poppins-Medium', color: '#555', marginBottom: 30, marginHorizontal: 5 }}>
                            Don't worry! Just enter your email and we'll send you an OTP to reset your password.
                        </Text>

                        <TextInput value={email} onChangeText={setEmail} placeholder="Enter your email" keyboardType="email-address" placeholderTextColor="#999"
                            style={{ borderWidth: 1, borderColor: '#000', borderRadius: 12, paddingHorizontal: 15, height: 45, fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-SemiBold', marginBottom: 30, color: '#000' }}
                        />

                        <TouchableOpacity onPress={nextHandler} style={{ backgroundColor: '#1f8dba', flexDirection: 'row', gap: 5, justifyContent: 'center', alignItems: 'center', height: responsiveHeight(6), borderRadius: 15 }}>
                            {loading ? (
                                <ActivityIndicator size='small' color={'#fff'} />
                            ) : (
                                <>
                                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold' }}>Proceed</Text>
                                    <Ionicons name="arrow-forward" size={20} color={'#fff'} />
                                </>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Slide 2: OTP */}
                    <View style={{ width: screenWidth, paddingHorizontal: 10 }}>
                        <Text style={{ fontSize: responsiveFontSize(2.4), fontFamily: 'Poppins-SemiBold', color: '#000', marginBottom: 5 }}>Enter OTP</Text>

                        <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-Medium', color: '#555', marginBottom: 30 }}>
                            We've sent an OTP to <Text style={{ fontFamily: 'Poppins-SemiBold', color: '#000' }}>{email}</Text>. Please enter it below to set a new password.
                        </Text>

                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 }}>
                            {[0, 1, 2, 3, 4, 5].map((_, index) => (
                                <TextInput
                                    key={index}
                                    ref={(ref) => (inputs.current[index] = ref)}
                                    value={otp[index] || ''}
                                    onChangeText={(text) => handleOtpChange(text, index)}
                                    keyboardType="numeric"
                                    maxLength={1}
                                    style={{ borderWidth: 1.2, borderColor: '#000', borderRadius: 10, width: 50, height: 50, fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-Bold', textAlign: 'center', color: '#000' }}
                                    placeholderTextColor="#999"
                                />
                            ))}
                        </View>

                        <TouchableOpacity onPress={verifyOtpHandler} style={{ marginTop: 20, backgroundColor: '#1f8dba', justifyContent: 'center', alignItems: 'center', height: responsiveHeight(6), borderRadius: 15 }}>
                            {loading ? (
                                <ActivityIndicator size={'small'} color={'#fff'} />
                            ) : (
                                <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold' }}>Verify OTP</Text>
                            )}
                        </TouchableOpacity>

                        {/* Resend OTP Section */}
                        <TouchableOpacity
                            onPress={resendOtpHandler}
                            disabled={!canResend}
                            style={{ alignSelf: 'center', marginTop: 5 }}
                        >
                            <Text style={{ fontSize: responsiveFontSize(1.7), color: canResend ? '#1f8dba' : '#aaa', fontFamily: 'Poppins-Medium' }}>
                                {canResend ? 'Resend OTP' : `Resend OTP in ${timer}s`}
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Slide 3: Reset Password */}
                    <View style={{ width: screenWidth, paddingHorizontal: 10 }}>
                        {/* Headline */}
                        <Text style={{ fontSize: responsiveFontSize(2.4), fontFamily: 'Poppins-SemiBold', color: '#000', marginBottom: 20 }}>Set New Password</Text>

                        {/* Password */}
                        <TextInput
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter new password"
                            placeholderTextColor="#999"
                            style={{ borderWidth: 1, borderColor: '#000', borderRadius: 12, paddingHorizontal: 15, height: 45, fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-SemiBold', marginBottom: 20, color: '#000' }}
                        />

                        {/* Confirm password */}
                        <TextInput
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            placeholder="Confirm new password"
                            placeholderTextColor="#999"
                            style={{ borderWidth: 1, borderColor: '#000', borderRadius: 12, paddingHorizontal: 15, height: 45, fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-SemiBold', marginBottom: 30, color: '#000' }}
                        />

                        {/* Change password button */}
                        <TouchableOpacity onPress={changePasswordHandler} style={{ backgroundColor: '#1f8dba', justifyContent: 'center', alignItems: 'center', height: responsiveHeight(6), borderRadius: 15 }}>
                            {loading ? (
                                <ActivityIndicator size={'small'} color={'#fff'} />
                            ) : (
                                <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold' }}>Change Password</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ForgotPassword;