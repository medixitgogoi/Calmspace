import LottieView from 'lottie-react-native';
import { useState } from 'react';
import { View, Text, Image, TextInput, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import RadioButton from '../components/RadioButton';
import Toast from 'react-native-toast-message';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import axios from 'axios';

const SignUp = ({ navigation }) => {

    const [selectedGender, setSelectedGender] = useState(null);
    const [selectedRole, setSelectedRole] = useState(null);

    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState(0);

    const handleSignUp = async () => {
        // Ensure all fields are filled
        if (!name || !password || !email || !age || !selectedGender || !selectedRole) {
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

            const data = {
                name: name,
                email: email,
                age: age,  // Age as a number
                password: password,
                gender: selectedGender,
                role: selectedRole
            };

            const response = await axios.post('/auth/register', data, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('Sign Up Successful: ', response);

            if (response?.data?.status_code === 201) {
                Toast.show({
                    type: 'success',
                    text1: 'Sign up successful',
                    text2: response?.data?.message || '',
                    position: 'top',
                    topOffset: 40,
                });

                navigation.navigate('Login');
            } else if (response?.data?.status_code === 402) {
                Toast.show({
                    type: 'error',
                    text1: 'Error signing up',
                    text2: response?.data?.message || '',
                    position: 'top',
                    topOffset: 40,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Registration failed',
                text2: 'User is already registered. Please head to the login page.',
                position: 'top',
                topOffset: 40,
            });

            console.log('sign up error: ', error?.message || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1, backgroundColor: '#fff' }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'} // Handles different keyboard behavior for iOS and Android
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {/* Image */}
                <View style={{ height: responsiveHeight(20), width: '100%' }}>
                    <Image source={require('../assets/background.png')} style={{ position: 'absolute', height: '190%', width: '100%' }} />
                </View>

                {/* logo */}
                <View style={{ backgroundColor: 'red', width: '100%', top: -130, left: 30 }}>
                    <Image source={require('../assets/logoback.png')} style={{ position: 'absolute', height: 50, width: 50, top: 0 }} />
                </View>

                {/* Sign up Form */}
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 30,
                        paddingBottom: 30,
                        alignItems: 'center' // Ensures full-width alignment
                    }}
                    keyboardShouldPersistTaps="handled" // Allows closing the keyboard by tapping outside
                    style={{ width: '100%' }} // Ensures the ScrollView itself takes full width
                >
                    {/* Lottie Animation */}
                    <View style={{ width: 300, height: 300, alignSelf: 'center', marginBottom: 20 }}>
                        <LottieView
                            source={require('../assets/animations/signup.json')}
                            autoPlay
                            loop
                            style={{ height: '100%', alignSelf: 'center', marginBottom: 20, width: '100%' }}
                        />
                    </View>

                    <Text style={{ fontFamily: 'Poppins-Bold', fontSize: 25, textAlign: 'center', marginBottom: 40, color: '#000', textTransform: 'uppercase' }}>Sign up</Text>

                    {/* Name */}
                    <TextInput
                        placeholder="Name"
                        value={name}
                        onChangeText={setName}
                        placeholderTextColor={'grey'}
                        style={{ height: 50, width: '100%', fontFamily: 'Poppins-SemiBold', backgroundColor: '#f3f3f3', borderColor: '#1f8dba', borderWidth: 1.5, fontWeight: '600', fontSize: 15, borderRadius: 15, paddingHorizontal: 15, marginBottom: 20, color: '#000' }}
                    />

                    {/* Email */}
                    <TextInput
                        placeholder="Email"
                        value={email}
                        keyboardType='email-address'
                        onChangeText={setEmail}
                        placeholderTextColor={'grey'}
                        style={{ height: 50, width: '100%', borderRadius: 15, fontFamily: 'Poppins-SemiBold', fontWeight: '600', borderColor: '#1f8dba', borderWidth: 1.5, backgroundColor: '#f3f3f3', color: '#000', fontSize: 15, paddingHorizontal: 15, marginBottom: 20 }}
                    />

                    {/* Password */}
                    <TextInput
                        placeholder="Password"
                        secureTextEntry
                        placeholderTextColor={'grey'}
                        value={password}
                        onChangeText={setPassword}
                        style={{ height: 50, borderRadius: 15, width: '100%', fontFamily: 'Poppins-SemiBold', fontWeight: '600', borderColor: '#1f8dba', borderWidth: 1.5, backgroundColor: '#f3f3f3', color: '#000', fontSize: 15, paddingHorizontal: 15, marginBottom: 20 }}
                    />

                    {/* Age */}
                    <TextInput
                        placeholder="Age"
                        keyboardType='numeric'
                        placeholderTextColor={'grey'}
                        value={age}
                        onChangeText={setAge}
                        style={{ height: 50, borderRadius: 15, width: '100%', fontFamily: 'Poppins-SemiBold', fontWeight: '600', borderColor: '#1f8dba', borderWidth: 1.5, backgroundColor: '#f3f3f3', color: '#000', fontSize: 15, paddingHorizontal: 15, marginBottom: 20 }}
                    />

                    {/* Gender Selection */}
                    <View style={{ backgroundColor: "#f3f3f3", borderColor: "#1f8dba", borderWidth: 1.5, width: "100%", borderRadius: 15, padding: 15, marginBottom: 20 }}>
                        <Text style={{ color: "grey", fontFamily: "Poppins-SemiBold", fontSize: 15, marginBottom: 10 }}>Gender</Text>

                        <View style={{ paddingLeft: 10 }}>
                            <RadioButton label="Male" selected={selectedGender === "male"} onPress={() => setSelectedGender("male")} />
                            <RadioButton label="Female" selected={selectedGender === "female"} onPress={() => setSelectedGender("female")} />
                        </View>
                    </View>

                    {/* Role Selection */}
                    <View style={{ backgroundColor: "#f3f3f3", borderColor: "#1f8dba", borderWidth: 1.5, width: "100%", borderRadius: 15, padding: 15, marginBottom: 30 }}>
                        <Text style={{ color: "grey", fontFamily: "Poppins-SemiBold", fontSize: 15, marginBottom: 10 }}>Role</Text>

                        <View style={{ paddingLeft: 10 }}>
                            <RadioButton label="User" selected={selectedRole === "user"} onPress={() => setSelectedRole("user")} />
                            <RadioButton label="Counselor" selected={selectedRole === "counselor"} onPress={() => setSelectedRole("counselor")} />
                        </View>
                    </View>

                    {/* Sign up */}
                    <TouchableOpacity
                        onPress={handleSignUp}
                        style={{ backgroundColor: '#1f8dba', width: '100%', height: 58, borderRadius: 15, justifyContent: 'center', alignItems: 'center' }}
                    >
                        {loading ? (
                            <ActivityIndicator size='large' color={'#fff'} />
                        ) : (
                            <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.4), fontWeight: '600', fontFamily: 'Poppins-Bold' }}>Sign Up</Text>
                        )}
                    </TouchableOpacity>

                    {/* Already have an account / login */}
                    <TouchableOpacity style={{ marginTop: 15, marginRight: 2, alignItems: 'center', flexDirection: 'row', alignItems: 'center', gap: 5, justifyContent: 'flex-end' }}>
                        <Text style={{ color: '#bdbdbd', fontSize: 14, fontWeight: '500', fontFamily: 'Poppins-Medium' }}>Already have an account?</Text>

                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ color: '#1f8dba', fontWeight: '600', fontFamily: 'Poppins-SemiBold' }}>Log In</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </KeyboardAvoidingView >
    )
}

export default SignUp;