import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useState } from 'react';
import { Dimensions, Image, StatusBar, Text, TextInput, TouchableOpacity, View, ScrollView, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { logoutUser } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Entypo from 'react-native-vector-icons/Entypo';
import { primary } from '../utils/colors';
import { useFocusEffect } from '@react-navigation/native';
import { fetchUserData } from '../utils/fetchUserData';

const Profile = ({ navigation }) => {

    const userDetails = useSelector(state => state.user);

    const authToken = userDetails?.[0]?.authToken;

    const dispatch = useDispatch();
    const [selectedSound, setSelectedSound] = useState('Default');
    const [showDropdown, setShowDropdown] = useState(false);

    const [showLogoutPrompt, setShowLogoutPrompt] = useState(false);

    const [userName, setUserName] = useState(null);
    const [userEmail, setUserEmail] = useState(null);

    const logOutHandler = async () => {
        try {
            dispatch(logoutUser());
            await AsyncStorage.removeItem('userDetails');
        } catch {
            Toast.show({
                type: 'error',
                text1: 'Failed to log out',
                text2: `Please try again`,
                position: 'top',
                topOffset: 40,
            });
        }
    };

    // Fetch user data
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = await fetchUserData(authToken); // Fetch user data

                    setUserName(data?.user?.name);
                    setUserEmail(data?.user?.email);

                } catch (error) {
                    console.log('Error fetching user data: ', error);
                } finally {
                    setLoading(false);
                }
            };

            fetchData();

            return () => { };
        }, [])
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F8F9FC' }}>
                {/* Status Bar */}
                <StatusBar animated={true} barStyle={'dark-content'} hidden={false} />

                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'space-between', marginBottom: 10 }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
                        <Ionicons name="arrow-back" size={27} color={'#333'} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>My Profile</Text>

                    <View style={{ width: 35, height: 35 }}></View>
                </View>

                <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
                    <ImageBackground source={require('../assets/gradient.jpg')} imageStyle={{ borderRadius: 30 }} style={{ marginHorizontal: 12, padding: 20, alignItems: 'center', overflow: 'hidden' }}>
                        <Image source={require('../assets/avatar.jpg')} style={{ width: 130, height: 130, borderRadius: 100, marginBottom: 10 }} />
                        <Text style={{ fontSize: responsiveFontSize(2.1), fontFamily: 'Poppins-SemiBold', color: '#000' }}>{userName}</Text>
                        <Text style={{ fontSize: 14, color: '#000', marginTop: 2, fontFamily: 'Poppins-Medium' }}>{userEmail}</Text>
                    </ImageBackground>

                    {/* Booking History */}
                    <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 15, paddingVertical: 14, paddingHorizontal: 18, marginHorizontal: 12, marginTop: 20, elevation: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ backgroundColor: primary, padding: 4, width: 33, height: 33, marginRight: 10, borderRadius: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="time-outline" size={22} color="#fff" />
                            </View>

                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2) }}>Booking History</Text>
                        </View>

                        <Ionicons name="chevron-forward" size={20} color="#000" />
                    </TouchableOpacity>

                    {/* Homework */}
                    <TouchableOpacity style={{ backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderRadius: 15, paddingVertical: 14, paddingHorizontal: 18, marginHorizontal: 12, marginTop: 20, elevation: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ backgroundColor: primary, padding: 4, width: 33, height: 33, marginRight: 10, borderRadius: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                                <Ionicons name="book-outline" size={20} color="#fff" />
                            </View>

                            <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2) }}>Homework</Text>
                        </View>

                        <Ionicons name="chevron-forward" size={20} color="#000" />
                    </TouchableOpacity>
                </ScrollView>

                {/* Logout */}
                <TouchableOpacity onPress={() => setShowLogoutPrompt(true)} style={{ backgroundColor: '#000', width: '97%', alignSelf: 'center', paddingVertical: 12, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderRadius: 18, marginTop: 40, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 4, position: 'absolute', bottom: 5 }}>
                    <Ionicons name="log-out-outline" size={22} color="#fff" style={{ marginRight: 8 }} />
                    <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-SemiBold', paddingTop: 4 }}>Logout</Text>
                </TouchableOpacity>

                {/* Logout prompt */}
                {showLogoutPrompt && (
                    <TouchableWithoutFeedback onPress={() => setShowLogoutPrompt(false)}>
                        <View style={{ position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' }}>
                            <TouchableWithoutFeedback>
                                <View style={{ backgroundColor: '#fff', width: '80%', borderRadius: 20, padding: 20, alignItems: 'center' }}>
                                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2.1), marginBottom: 16, textAlign: 'center', color: '#000' }}>
                                        Are you sure you want to logout?
                                    </Text>

                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                                        <TouchableOpacity onPress={() => setShowLogoutPrompt(false)} style={{ backgroundColor: '#e0e0e0', flex: 1, marginRight: 10, paddingVertical: 10, borderRadius: 12, alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: responsiveFontSize(1.8), color: '#000' }}>Cancel</Text>
                                        </TouchableOpacity>

                                        <TouchableOpacity onPress={logOutHandler} style={{ backgroundColor: '#000', flex: 1, marginLeft: 10, paddingVertical: 10, borderRadius: 12, alignItems: 'center' }}>
                                            <Text style={{ fontFamily: 'Poppins-Medium', fontSize: responsiveFontSize(1.8), color: '#fff' }}>Yes</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Profile;