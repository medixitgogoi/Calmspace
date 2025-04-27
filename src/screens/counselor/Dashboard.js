import { View, Text, StatusBar, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/userSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchUserData } from '../../utils/fetchUserData';
import Toast from 'react-native-toast-message';
import InfoRow from '../../components/InfoRow';
import Sidebar from '../../components/Sidebar';
import LottieView from 'lottie-react-native';

const Dashboard = ({ navigation }) => {

    const [sidebarVisible, setSidebarVisible] = useState(false);

    const userDetails = useSelector(state => state.user);
    const authToken = userDetails?.authToken;
    const dispatch = useDispatch();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

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

    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = await fetchUserData(authToken);
                    
                    setData(data?.user);
                } catch (error) {
                    console.log('Error fetching counselor data: ', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchData();
            return () => { };
        }, [])
    );

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#ecf9f9' }}>
                    {/* Lottie Animation */}
                    <View style={{ width: 270, height: 270, alignSelf: 'center', marginBottom: 20 }}>
                        <LottieView
                            source={require('../../assets/animations/loading.json')}
                            autoPlay
                            loop
                            style={{ height: '100%', alignSelf: 'center', marginBottom: 20, width: '100%' }}
                        />
                    </View>
                </SafeAreaView>
            </SafeAreaProvider>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, backgroundColor: '#fff' }}>
                <StatusBar barStyle="dark-content" backgroundColor="#ecf9f9" />

                <TouchableOpacity onPress={() => setSidebarVisible(true)} style={{ position: 'absolute', top: 35, left: 15 }}>
                    <Ionicons name="menu-outline" size={25} color="#0f172a" />
                </TouchableOpacity>

                <Sidebar
                    visible={sidebarVisible}
                    onClose={() => setSidebarVisible(false)}
                    onLogout={logOutHandler}
                    onQuickBoost={() => {
                        setSidebarVisible(false);
                        navigation.navigate('QuickBoost');
                    }}
                />

                {/* Profile Section */}
                <View style={{ alignItems: 'center', marginTop: 40 }}>
                    <Image
                        source={{ uri: data?.pic }}
                        style={{
                            width: 100,
                            height: 100,
                            borderRadius: 50,
                            borderWidth: 2,
                            borderColor: '# ',
                            marginBottom: 10,
                        }}
                    />
                    <Text style={{
                        fontFamily: 'Poppins-SemiBold',
                        fontSize: responsiveFontSize(2.5),
                        color: '#0f172a'
                    }}>
                        {data?.name}
                    </Text>
                    <Text style={{
                        fontFamily: 'Poppins-Regular',
                        fontSize: responsiveFontSize(1.8),
                        color: '#475569'
                    }}>
                        {data?.email}
                    </Text>
                </View>

                {/* Info Section */}
                <View style={{
                    marginTop: 30,
                    backgroundColor: '#ffffff',
                    padding: 10,
                    borderRadius: 20,
                    elevation: 4,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.2,
                    shadowRadius: 4
                }}>
                    <View style={{
                        backgroundColor: '#e0f7fb',
                        paddingVertical: 10,
                        paddingHorizontal: 16,
                        borderRadius: 10,
                        marginBottom: 20
                    }}>
                        <Text style={{
                            fontFamily: 'Poppins-SemiBold',
                            fontSize: responsiveFontSize(2.2),
                            color: '#0ea5e9',
                            textAlign: 'center'
                        }}>
                            About Counselor
                        </Text>
                    </View>

                    <InfoRow label="Age" value={data?.age} />
                    <InfoRow label="Gender" value={data?.gender} />
                    <InfoRow label="Role" value={data?.role} />
                    <InfoRow label="Email Verified" value={data?.emailVerified ? "Yes" : "No"} />
                    <InfoRow
                        label="Joined on"
                        value={new Date(data?.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                        })}
                    />
                </View>

                {/* Update Profile Button */}
                <TouchableOpacity
                    onPress={() => navigation.navigate('UpdateProfile')}
                    style={{ backgroundColor: '#f7fdfd', paddingVertical: 12, marginTop: 40, borderRadius: 12, alignItems: 'flex-start', borderColor: '#0ea5e9', borderWidth: 1, flexDirection: 'row', justifyContent: 'center' }}
                >
                    <Ionicons name="create-outline" size={22} color="#0ea5e9" style={{ marginRight: 5 }} />

                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2.1), color: '#0ea5e9', letterSpacing: 1 }}>
                        Update Profile
                    </Text>
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity
                    onPress={logOutHandler}
                    style={{ backgroundColor: '#0ea5e9', paddingVertical: 12, marginTop: 15, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                >
                    <Ionicons name="log-out-outline" size={22} color="#fff" style={{ marginRight: 5 }} />
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2.1), color: '#fff', letterSpacing: 1 }}>
                        Logout
                    </Text>
                </TouchableOpacity>

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Dashboard;
