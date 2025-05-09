import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';
import { useSelector } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import LinearGradient from 'react-native-linear-gradient';
import Home from '../screens/Home';
import ProfileCreation from '../auth/ProfileCreation';
import Welcome from '../auth/Welcome';
import Profile from '../screens/Profile';
import QuizQuestions from '../screens/QuizQuestions';
import PercentageShow from '../screens/PercentageShow';
import Counselors from '../screens/Counselors';
import AiChat from '../screens/AiChat';
import Boost from '../screens/Boost';
import Community from '../screens/Community';
import { StyleSheet } from 'react-native';
import { secondary } from '../utils/colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import BlogDetails from '../screens/BlogDetails';
import CounselorDetails from '../screens/CounselorDetails';

import Dashboard from '../screens/counselor/Dashboard';
import UpdateProfile from '../screens/counselor/UpdateProfile';
import QuickBoost from '../screens/counselor/QuickBoost';
import AddDetails from '../screens/counselor/AddDetails';
import BoostChat from '../screens/BoostChat';
import QuickBoostChat from '../screens/counselor/QuickBoostChat';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabBarBackground = () => (
    <LinearGradient colors={['#267f7f', '#32a2a3']} style={styles.tabBarBackground} />
);

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    height: responsiveHeight(6.5),
                    backgroundColor: '#309e9f',
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                    overflow: 'hidden',
                },
                tabBarBackground: () => <TabBarBackground />,
                tabBarItemStyle: { paddingVertical: 3 },
                tabBarActiveTintColor: secondary,
                tabBarInactiveTintColor: '#fff',
                tabBarLabelStyle: { fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(1.2) },
                tabBarIcon: ({ color, focused }) => {
                    const iconSize = focused ? 22 : 18;
                    color = focused ? secondary : '#fff';

                    if (route.name === "Home") {
                        const iconName = focused ? "home" : "home-outline";
                        return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
                    } else if (route.name === "Counselors") {
                        const iconName = focused ? "account-multiple" : "account-multiple-outline";
                        return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
                    } else if (route.name === "AiChat") {
                        const iconName = focused ? "chat-processing" : "chat-processing-outline";
                        return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
                    } else if (route.name === "Boost") {
                        const iconName = focused ? "lightning-bolt" : "lightning-bolt-outline";
                        return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
                    } else if (route.name === "Community") {
                        const iconName = focused ? "account-group" : "account-group-outline";
                        return <MaterialCommunityIcons name={iconName} size={iconSize} color={color} />;
                    }
                },
                tabBarLabel: ({ focused, color }) => (
                    <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: focused ? responsiveFontSize(1.3) : responsiveFontSize(1.1), color }}>
                        {route.name === "AiChat" ? "AI Chat" : route.name}
                    </Text>
                ),
            })}
        >
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Counselors" component={Counselors} />
            <Tab.Screen name="AiChat" component={AiChat} options={{ title: 'AI Chat' }} />
            <Tab.Screen name="Boost" component={Boost} />
            <Tab.Screen name="Community" component={Community} />
        </Tab.Navigator>
    );
};

const GuestStackNavigator = () => {

    const userDetails = useSelector(state => state.user);
    const isProfileCreationDone = userDetails?.profileStatus;
    const isCounselor = userDetails?.role === 'counselor';

    return (
        <View style={{ flex: 1 }}>
            <Stack.Navigator
                initialRouteName={
                    isCounselor
                        ? 'Dashboard'
                        : isProfileCreationDone
                            ? 'Main'
                            : 'Welcome'
                }
                screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                }}
            >
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="ProfileCreation" component={ProfileCreation} />
                <Stack.Screen name="Main" component={TabNavigator} />
                <Stack.Screen name="Profile" component={Profile} />
                <Stack.Screen name="QuizQuestions" component={QuizQuestions} />
                <Stack.Screen name="PercentageShow" component={PercentageShow} />
                <Stack.Screen name="BlogDetails" component={BlogDetails} />
                <Stack.Screen name="BoostChat" component={BoostChat} />
                <Stack.Screen name="CounselorDetails" component={CounselorDetails} />

                {/* Counselor */}
                <Stack.Screen name="Dashboard" component={Dashboard} />
                <Stack.Screen name="UpdateProfile" component={UpdateProfile} />
                <Stack.Screen name="QuickBoost" component={QuickBoost} />
                <Stack.Screen name="QuickBoostChat" component={QuickBoostChat} />
                <Stack.Screen name="AddDetails" component={AddDetails} />
            </Stack.Navigator>
        </View>
    );
};

const styles = StyleSheet.create({
    tabBarBackground: {
        flex: 1,
        borderTopLeftRadius: 18,
        borderTopRightRadius: 18,
    },
});

export default GuestStackNavigator;