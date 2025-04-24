import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import axios from "axios";
import AuthStackNavigator from './AuthStackNavigator';
import GuestStackNavigator from './GuestStackNavigator';
import { addUser } from '../redux/userSlice';
import { useDispatch, useSelector } from 'react-redux';

axios.defaults.baseURL = 'https://calmspace-ts-server.onrender.com/api/';

const Stacknavigation = () => {

    const dispatch = useDispatch();

    const userDetails = useSelector(state => state.user);

    const [loading, setLoading] = useState(true);

    const isUserLoggedIn = userDetails?.length > 0 && userDetails?.some(item => item.authToken);

    // Load login details from Async Storage
    useEffect(() => {
        const checkUser = async () => {
            try {
                const user = await AsyncStorage.getItem('userDetails');

                if (user) {
                    dispatch(addUser(JSON.parse(user)));
                }

                // console.log('user details: ', user)
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 1800);
            }
        };

        checkUser();
    }, []);

    // Show the Splash Screen in the beginning
    if (loading) {
        return (
            <NavigationContainer>
                <AuthStackNavigator initialRoute="Splashscreen" />
            </NavigationContainer>
        );
    };

    return (
        <NavigationContainer>
            {isUserLoggedIn ? (
                <GuestStackNavigator />
            ) : (
                <AuthStackNavigator initialRoute="Login" />
            )}
        </NavigationContainer>
    );
};

export default Stacknavigation;