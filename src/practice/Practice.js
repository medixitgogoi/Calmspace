import { useEffect, createContext, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SERVER_URL } from '@env';
import Toast from 'react-native-root-toast';

const UserContext = createContext();

const UserProvider = ({ children }) => {

    const navigation = useNavigation();
    const [user, setUser] = useState(null);
    const [authStatus, setAuthStatus] = useState(false);
    const [cartProducts, setCartProducts] = useState([]);
    const [address, setAddress] = useState([]);
    const [prescriptions, setPrescriptions] = useState([]);
    const url = SERVER_URL;

    useEffect(() => {
    }, [cartProducts, authStatus, prescriptions])

    const getAuthStatus = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (authToken === null) {
                setAuthStatus(false);
            } else {
                setAuthStatus(true);
            }
        } catch (error) {
            if (error.message === 'Network request failed') {
                console.error('Network Request Failed!')
            } else {
                console.error('Error retrieving authToken from getAuthStatus:', error);
            }
        }
    };

    const getUserData = async () => {
        try {
            const authToken = await AsyncStorage.getItem('authToken');
            if (authToken !== null) {
                let response = await fetch(url + "/api/auth/getuser", {
                    method: "POST",
                    headers: {
                        "auth-token": authToken,
                    },
                });
                const userDetails = await response.json();
                setUser(userDetails);
            } else {
                setUser(null);
            }
        }
        catch (error) {
            if (error.message === 'Network request failed') {
                console.error('Network Request Failed!')
            } else {
                console.error('Error retrieving authToken from getUserData:', error);
            }
        }
    };

    const contextValue = { user, authStatus, url, setAuthStatus, setCartProducts, getAuthStatus, getUserData, }

    return (
        <UserContext.Provider value={contextValue}>
            {children}
        </UserContext.Provider>
    );
};

export { UserContext, UserProvider };