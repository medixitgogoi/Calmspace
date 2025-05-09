import { View, Text, StatusBar, TouchableOpacity, Image } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useEffect, useState } from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { fetchUserData } from '../../utils/fetchUserData';
import InfoRow from '../../components/InfoRow';
import Sidebar from '../../components/Sidebar';
import LottieView from 'lottie-react-native';
import { getCounselorByID } from '../../utils/getCounselorByID';

const Dashboard = ({ navigation }) => {

    const [sidebarVisible, setSidebarVisible] = useState(false);

    const userDetails = useSelector(state => state.user);
    const authToken = userDetails?.authToken;

    const [data, setData] = useState(null);

    const [newCounselor, setNewCounselor] = useState(false);

    const [loading, setLoading] = useState(true);
    const [userLoading, setUserLoading] = useState(true);
    const [counselorLoading, setCounselorLoading] = useState(true);

    // fetchUserData
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = await fetchUserData(authToken);

                    setData(data?.user);
                } catch (error) {
                    console.log('Error fetching counselor data: ', error);
                } finally {
                    setUserLoading(false);
                }
            };

            fetchData();
            return () => { };
        }, [])
    );

    // getCounselorByID
    useFocusEffect(
        useCallback(() => {
            const fetchData = async () => {
                try {
                    const data = await getCounselorByID(authToken);

                    if (data?.degree) {
                        setNewCounselor(false);
                    } else {
                        setNewCounselor(true);
                    }

                } catch (error) {
                    console.log('Error fetching counselor: ', error);
                } finally {
                    setCounselorLoading(false);
                }
            };

            fetchData();
        }, [])
    );

    // Combine loading states
    useEffect(() => {
        if (!userLoading && !counselorLoading) {
            setLoading(false);
        }
    }, [userLoading, counselorLoading]);

    // loading UI
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

                {/* Menu icon */}
                <TouchableOpacity onPress={() => setSidebarVisible(true)} style={{ position: 'absolute', top: 35, left: 15 }}>
                    <Ionicons name="menu-outline" size={25} color="#0f172a" />
                </TouchableOpacity>

                {/* Sidebar */}
                <Sidebar
                    visible={sidebarVisible}
                    onClose={() => setSidebarVisible(false)}
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
                <View style={{ marginTop: 30, backgroundColor: '#ffffff', padding: 10, borderRadius: 20, elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 4 }}>
                    <View style={{ backgroundColor: '#e0f7fb', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 10, marginBottom: 20 }}>
                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2.2), color: '#0ea5e9', textAlign: 'center' }}>
                            About Counselor
                        </Text>
                    </View>

                    <InfoRow label="Age" value={data?.age} />
                    <InfoRow label="Gender" value={data?.gender} />
                    <InfoRow label="Role" value={data?.role} />
                    <InfoRow label="Email Verified" value={data?.emailVerified ? "Yes" : "No"} />
                    <InfoRow label="Joined on" value={new Date(data?.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} />
                </View>

                {/* Add Details Button */}
                {newCounselor ? (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('AddDetails')}
                        style={{ backgroundColor: '#0ea5e9', paddingVertical: 12, marginTop: 20, borderRadius: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <Ionicons name="log-out-outline" size={23} color="#fff" style={{ marginRight: 5 }} />

                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2), color: '#fff', letterSpacing: 1 }}>
                            Add Details
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('UpdateProfile')}
                        style={{ backgroundColor: '#f7fdfd', paddingVertical: 12, marginTop: 20, borderRadius: 12, alignItems: 'center', borderColor: '#0ea5e9', borderWidth: 1, flexDirection: 'row', justifyContent: 'center' }}
                    >
                        <Ionicons name="create-outline" size={23} color="#0ea5e9" style={{ marginRight: 5 }} />

                        <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2), color: '#0ea5e9', letterSpacing: 1 }}>
                            Update Profile
                        </Text>
                    </TouchableOpacity>
                )}

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default Dashboard;