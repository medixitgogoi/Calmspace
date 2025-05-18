// This is the counselor screen for Quick Boost. For user Quick Boost screen, it is named as Boost.

import { useCallback, useEffect, useState } from 'react';
import { View, Text, StatusBar, Switch, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { getCounselorByID } from '../../utils/getCounselorByID';
import Toast from 'react-native-toast-message';
import CounselorChat from '../../components/CounselorChat';
import { primary, secondary } from '../../utils/colors';
import { useFocusEffect } from '@react-navigation/native';
import { connectSocket } from '../../redux/socketSlice';

const QuickBoost = ({ navigation }) => {

    const socket = useSelector((state) => state.socket.socket);
    console.log('socket from Quick Boost: ', socket);

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.user);
    const authToken = userDetails?.authToken;

    const [isAvailable, setIsAvailable] = useState(false);

    const [loading, setLoading] = useState(true);

    const [toggleLoading, setToggleLoading] = useState(false);

    const [details, setDetails] = useState(null);

    const handleToggle = async (value) => {

        setToggleLoading(true);

        try {
            const response = await axios.post('/counselor/Updateonline', {}, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                }
            });

            if (response?.data?.status_code === 201) {
                setIsAvailable(value);
            }

            console.log('update online response: ', response);
        } catch (error) {
            console.log("Error: ", error.message);
        } finally {
            setToggleLoading(false);
        }
    };

    // getCounselorByID
    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const fetchData = async () => {
                try {
                    const data = await getCounselorByID(authToken);

                    if (data !== null && isActive) {
                        setDetails(data);

                        if (data?.status === 'online') {
                            setIsAvailable(true);
                        } else {
                            setIsAvailable(false);
                        }
                    }

                } catch (error) {
                    console.log('Error fetching counselor: ', error);
                } finally {
                    if (isActive) {
                        setLoading(false);
                    }
                }
            };

            fetchData();

            return () => {
                isActive = false; // Cleanup on unfocus
            };

        }, [authToken]) // dependencies
    );

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.centeredContainer}>
                    <ActivityIndicator size={'large'} color={'#0ea5e9'} />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 8, backgroundColor: '#fff' }}>
                <StatusBar barStyle="dark-content" backgroundColor="#ecf9f9" />

                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Ionicons name="arrow-back" size={25} color={'#333'} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>
                        Quick Boost
                    </Text>

                    <View style={{ width: 35, height: 35 }} />
                </View>

                {/* Toggle quick boost */}
                {details !== null && (
                    <View style={styles.toggleContainer}>
                        <Text style={styles.toggleText}>
                            Make me available for Quick Boost
                        </Text>

                        <Switch
                            value={isAvailable}
                            onValueChange={handleToggle}
                            trackColor={{ false: '#ccc', true: secondary }}
                            thumbColor={isAvailable ? '#fff' : '#f4f3f4'}
                        />
                    </View>
                )}

                {/* Counselor Chat */}
                {details !== null && <CounselorChat navigation={navigation} />}

                {!loading && details === null && (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
                        <Text style={{ fontSize: responsiveFontSize(1.9), color: '#0f172a', textAlign: 'center', fontFamily: 'Poppins-Medium', marginBottom: 15 }}>
                            Please add your details first to access this feature.
                        </Text>

                        <TouchableOpacity
                            onPress={() => navigation.navigate('AddDetails')}
                            style={{ backgroundColor: '#0ea5e9', paddingVertical: 12, paddingHorizontal: 20, borderRadius: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                        >
                            <Ionicons name="add-circle-outline" size={22} color="#fff" style={{ marginRight: 8 }} />

                            <Text style={{ fontSize: responsiveFontSize(1.9), color: '#fff', fontFamily: 'Poppins-SemiBold', letterSpacing: 1 }}>
                                Add Details
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}

                {/* Full Screen Loader when toggleLoading */}
                {toggleLoading && (
                    <View style={styles.loadingOverlay}>
                        <ActivityIndicator size="large" color="#000" />
                    </View>
                )}
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = StyleSheet.create({
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#ecf9f9',
    },
    toggleContainer: {
        elevation: 1,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#0ea5e9',
        padding: 10,
        borderRadius: 12,
    },
    toggleText: {
        fontSize: responsiveFontSize(2),
        color: '#fff',
        fontFamily: 'Poppins-Medium',
    },
    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.3)', // dim the background
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999, // make sure it is on top
    }
});

export default QuickBoost;