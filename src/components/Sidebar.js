import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Dimensions, Animated, StyleSheet, Image } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primary } from '../utils/colors';
import { logoutUser } from '../redux/userSlice';
import { useDispatch } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const Sidebar = ({ visible, onClose, onLogout, onQuickBoost }) => {

    const dispatch = useDispatch();

    const [sidebarPosition] = useState(new Animated.Value(-width * 0.60));

    useEffect(() => {
        if (visible) {
            // Slide in from the left
            Animated.timing(sidebarPosition, {
                toValue: 0, // Move to the left side (visible)
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            // Slide out to the left (off-screen)
            Animated.timing(sidebarPosition, {
                toValue: -width * 0.60, // Move off-screen (left)
                duration: 300,
                useNativeDriver: true,
            }).start(() => {
                // Once the animation is finished, hide the sidebar by calling onClose
                onClose();
            });
        }
    }, [visible, sidebarPosition, onClose]);

    if (!visible) return null;

    // logout Handler
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

    return (
        <SafeAreaView style={{ ...StyleSheet.absoluteFillObject, flexDirection: 'row', zIndex: 10 }}>
            {/* Touchable background to close sidebar */}
            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} activeOpacity={1} onPress={onClose} />

            {/* Sidebar content with animation */}
            <Animated.View style={[{ width: width * 0.60, height, backgroundColor: '#fff', paddingTop: 40, paddingHorizontal: 15, elevation: 10, shadowColor: '#000', shadowOpacity: 0.2, shadowOffset: { width: -2, height: 0 }, shadowRadius: 4, position: 'absolute', left: 0 }, { transform: [{ translateX: sidebarPosition }] }]}>
                {/* Company Info */}
                <View style={{ marginBottom: 30, alignItems: 'center' }}>
                    {/* Placeholder logo box */}
                    <Image source={require('../assets/no_back_logo_color.png')} style={{ width: 100, height: 60, resizeMode: 'cover' }} />
                    <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-Bold', color: primary, marginTop: 0 }}>Calmspace</Text>
                </View>

                {/* Menu Options */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 5 }} onPress={onQuickBoost}>
                    <Ionicons name="flash-outline" size={20} color="#0ea5e9" />
                    <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-Medium', color: '#0f172a' }}>Quick Boost</Text>
                </TouchableOpacity>

                {/* Logout Option */}
                <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 5, marginTop: 20 }} onPress={logOutHandler}>
                    <Ionicons name="log-out-outline" size={20} color="#ef4444" />
                    <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-Medium', color: '#ef4444' }}>Logout</Text>
                </TouchableOpacity>
            </Animated.View>
        </SafeAreaView>
    );
};

export default Sidebar;