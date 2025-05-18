import { Image, StatusBar, Text, TouchableOpacity, View, ImageBackground, ScrollView, BackHandler, Alert, Platform, PermissionsAndroid } from 'react-native';
import { background, primary, secondary } from '../utils/colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
// import Ionicons from 'react-native-vector-icons/Ionicons';
import DailyQuote from '../components/DailyQuote';
import Quiz from '../components/Quiz';
import Features from '../components/Features';
import Blogs from '../components/Blogs';
import { useCallback, useEffect, useState } from 'react';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { fetchUserData } from '../utils/fetchUserData';
import { useDispatch, useSelector } from 'react-redux';
import ProgressBar from '../components/ProgressBar';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { connectSocket } from '../redux/socketSlice';
import { addUser } from '../redux/UserSlice';
// import Geolocation from '@react-native-community/geolocation';

const Home = ({ navigation }) => {

  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.user);
  // console.log('userDetails from Home: ', userDetails);

  const authToken = userDetails?.authToken;

  const isFocused = useIsFocused();

  const isAndroid15 = Platform.OS === 'android' && Platform.Version >= 15;
  // console.log('isAndroid15: ', isAndroid15);

  const [userName, setUserName] = useState(null);
  const [profileScore, setProfileScore] = useState(null);

  const [loading, setLoading] = useState(true);

  const [location, setLocation] = useState(null);

  const [userId, setUserId] = useState(null);

  // location
  // const requestLocationPermission = async () => {
  //   if (Platform.OS === 'android') {
  //     const granted = await PermissionsAndroid.request(
  //       PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
  //     );
  //     return granted === PermissionsAndroid.RESULTS.GRANTED;
  //   }

  //   return true; // iOS handles permission in Info.plist
  // };

  // const getCurrentLocation = async () => {

  //   const hasPermission = await requestLocationPermission();

  //   if (!hasPermission) return;

  //   Geolocation.getCurrentPosition(
  //     position => {
  //       setLocation(position);
  //     },
  //     error => {
  //       console.warn(error.message);
  //     },
  //     { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
  //   );
  // };

  // useEffect(() => {
  //   getCurrentLocation();
  // }, []);

  // if (location) {
  //   console.log('location: ', location);
  // }

  // Preventing from navigating back
  useEffect(() => {

    if (!isFocused) return; // Skip adding the BackHandler if not on Home

    const backAction = () => {
      Alert.alert('Hold on!', 'Are you sure you want to exit?', [
        { text: 'Cancel', onPress: () => null, style: 'cancel' },
        { text: 'YES', onPress: () => BackHandler.exitApp() },
      ]);
      return true; // Prevent default back button behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove(); // Cleanup
  }, [isFocused]);

  // Fetch user data
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await fetchUserData(authToken); // Fetch user data

          setUserName(data?.user?.name);
          setProfileScore(data?.questionScore);
          setUserId(data?.user?._id);
          dispatch(addUser(data?.user));
        } catch (error) {
          console.log('Error fetching user data: XD', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      return () => { }; // Cleanup function (optional)
    }, [authToken, dispatch])
  );

  // call connect socket
  useEffect(() => {
    dispatch(connectSocket({ userId: userId }));
  }, [dispatch, userId]);

  // useFocusEffect(
  //   useCallback(() => {
  //     const fetchData = async () => {
  //       try {
  //         const data = await fetchUserData(authToken); // Fetch user data

  //         setUserName(data?.user?.name);
  //         setProfileScore(data?.questionScore);
  //         setUserId(data?.user?._id);

  //         const userInfo = {
  //           name: data?.user?.name,
  //           email: data?.user?.email,
  //           userId: data?.user?._id,
  //         }

  //         dispatch(addUser());

  //       } catch (error) {
  //         console.log('Error fetching user data: ', error);
  //       } finally {
  //         setLoading(false);
  //       }
  //     };

  //     fetchData();

  //   }, [])
  // );

  return (
    <View style={{ flex: 1, backgroundColor: background }}>
      {/* StatusBar */}
      <StatusBar
        animated={true}
        barStyle={'light-content'}
        hidden={false}
      />

      {/* Header */}
      <ImageBackground
        source={require('../assets/imgback.jpg')}
        style={{ overflow: 'hidden', paddingTop: 40, paddingBottom: 30, borderBottomLeftRadius: 30, borderBottomRightRadius: 30 }}
        resizeMode="cover"
      >
        {/* Info display */}
        <View style={{ height: responsiveHeight(6), flexDirection: 'row', justifyContent: 'space-between', backgroundColor: '', paddingHorizontal: 10 }}>
          {/* Logo/display name */}
          <View style={{ backgroundColor: '', flexDirection: 'row', alignItems: 'center', gap: 3, }}>
            {/* logo */}
            <Image source={require('../assets/logoback_noName.png')} style={{ height: 40, width: 40 }} />

            {/* Name and location */}
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ color: '#fff', fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(1.8), marginLeft: 2 }}>Hi, {userName?.split(' ')?.[0] || 'User'}</Text>

              {/* Temporary */}
              <Text style={{ color: secondary, fontFamily: 'Poppins-Medium', fontSize: responsiveFontSize(1.6), marginLeft: 2 }}>Welcome back!</Text>

              {/* <View style={{ flexDirection: 'row', gap: 3, alignItems: 'flex-start', backgroundColor: '' }}>
                <Ionicons name="location" size={13} color={background} />
                <Text style={{ color: secondary, fontFamily: 'Poppins-Medium', fontSize: responsiveFontSize(1.4) }}>Ganeshguri, Guwahati</Text>
              </View> */}

            </View>
          </View>

          {/* Profile */}
          <View style={{ flex: 0.3, backgroundColor: '', flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 6, paddingRight: 5 }}>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={{ paddingTop: 4, backgroundColor: secondary, width: 35, height: 35, borderRadius: 50, borderColor: '#fff', borderWidth: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ color: primary, fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold' }}>{userName?.slice(0, 1) || 'U'}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Quotes */}
        <View style={{ height: responsiveHeight(10), backgroundColor: '', alignItems: 'center', flexDirection: 'row' }}>
          <DailyQuote />
        </View>

        {/* Banner */}
        <View style={{ height: responsiveHeight(13), flexDirection: 'row', justifyContent: 'center', alignItems: 'center', }}>
          <Image source={require('../assets/banner.png')} style={{ width: '100%', height: responsiveHeight(14) }} resizeMode='contain' />
        </View>
      </ImageBackground >

      {/* Content */}
      <ScrollView style={{ flexGrow: 1 }} contentContainerStyle={{ paddingTop: 10, paddingBottom: 20 }} nestedScrollEnabled={true}>

        {loading ? (
          <View style={{ marginHorizontal: 12 }}>
            {/* Title */}
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ width: '70%', height: 20, borderRadius: 10, marginTop: 15, alignSelf: 'center' }}
            />

            {/* CTA Button */}
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ width: '100%', height: 45, borderRadius: 50, marginTop: 15 }}
            />

            {/* Subtitle/Description */}
            <ShimmerPlaceHolder
              LinearGradient={LinearGradient}
              style={{ width: '100%', height: 14, borderRadius: 8, marginTop: 15 }}
            />
          </View>
        ) : (
          profileScore ? (
            <ProgressBar score={profileScore} />
          ) : (
            <Quiz />
          )
        )}

        {/* Features */}
        <Features />

        {/* Blogs */}
        <Blogs navigation={navigation} />

      </ScrollView>
    </View>
  );
};

export default Home;