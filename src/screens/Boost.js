import { useCallback, useEffect, useState } from 'react';
import { StatusBar, TouchableOpacity, View, FlatList, Image, ActivityIndicator, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { connectSocket } from '../redux/socketSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchCounselors } from '../utils/fetchCounselors';
import { primary } from '../utils/colors';
import { subscribeToMessages } from '../utils/subscribeToMessages';

const Boost = () => {

  const socket = useSelector((state) => state.socket.socket);
  const isConnected = useSelector((state) => state.socket.isConnected);

  const dispatch = useDispatch();

  const navigation = useNavigation();

  const userDetails = useSelector(state => state.user);
  const authToken = userDetails?.authToken;

  const [onlineCounselors, setOnlineCounselors] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // UseEffect to call connect socket
  useEffect(() => {
    dispatch(connectSocket({ userId: userDetails?._id }));
  }, []);

  useEffect(() => {
    if (socket) {
      subscribeToMessages(socket);
    }
  }, [socket]);

  // Fetch counselors
  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await fetchCounselors(authToken);
      const online = data?.filter(counselor => counselor?.status === 'online');
      setOnlineCounselors(online);
    } catch (error) {
      console.log('Error fetching counselors: ', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch counselors when focus changes or authToken changes
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [authToken])
  );

  // Handle pull to refresh
  const onRefresh = () => {
    setRefreshing(true);
    fetchData().then(() => setRefreshing(false));
  };

  // Render each counselor
  const renderCounselor = ({ item }) => (
    <View style={{ flexDirection: 'column', backgroundColor: '#fff', marginBottom: 16, borderRadius: 18, padding: 12, elevation: 6, marginHorizontal: 10 }}>
      {/* Image and details */}
      <View style={{ flexDirection: 'row' }}>
        {/* Left: Profile Image */}
        <Image
          source={{ uri: item?.counselorId?.pic }}
          style={{ width: 65, height: 65, borderRadius: 50, marginRight: 12 }}
        />

        {/* Right: Details */}
        <View style={{ flex: 1 }}>
          {/* Name with icon */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 20, height: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 6 }}>
              <MaterialIcons name="person" size={19} color={primary} />
            </View>

            <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-SemiBold', color: '#000', }}>
              {item?.counselorId?.name}
            </Text>
          </View>

          {/* Speciality Box */}
          <View style={{
            paddingVertical: 4,
            borderRadius: 12,
            marginVertical: 3,
            maxWidth: '90%', // Ensures the box doesn't overflow
          }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: 20, height: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 6 }}>
                <FontAwesome name="check-circle" size={16} color={primary} /> {/* Changed icon here */}
              </View>

              <Text style={{ fontSize: responsiveFontSize(1.7), fontFamily: 'Poppins-Medium', color: '#000' }}>
                {item.speciality && item.speciality.length > 0
                  ? item.speciality.join(', ')
                  : 'Speciality Not Available'}
              </Text>
            </View>
          </View>

          {/* Price */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 20, height: 20, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginRight: 6 }}>
              <FontAwesome5 name="rupee-sign" size={13} color={primary} />
            </View>

            <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-SemiBold', color: '#0f172a' }}>
              99
            </Text>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={{ flexDirection: 'row', width: '100%', paddingHorizontal: 0, justifyContent: 'space-between', marginTop: 10 }}>
        <TouchableOpacity style={{ width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: '#00b894', paddingVertical: 10, justifyContent: 'center', borderRadius: 12 }}>
          <MaterialCommunityIcons name="microphone" size={18} color="#fff" />
          <Text style={{ marginLeft: 4, color: '#fff', fontFamily: 'Poppins-Medium' }}>Voice Chat</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('BoostChat', { id: item?.counselorId?._id })} style={{ flexDirection: 'row', width: '48%', alignItems: 'center', backgroundColor: '#0984e3', paddingVertical: 10, justifyContent: 'center', borderRadius: 12 }}>
          <MaterialCommunityIcons name="message-text-outline" size={18} color="#fff" />
          <Text style={{ marginLeft: 4, color: '#fff', fontFamily: 'Poppins-Medium' }}>Text Chat</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        {/* StatusBar */}
        <StatusBar
          animated={true}
          barStyle={'dark-content'}
          hidden={false}
        />

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={25} color={'#333'} />
          </TouchableOpacity>

          <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>Quick Boost</Text>

          <View style={{ width: 35, height: 35 }}></View>
        </View>

        {/* Content */}
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#00b894" />
          </View>
        ) : (
          <FlatList
            data={onlineCounselors}
            keyExtractor={(item, index) => index.toString()}
            renderItem={renderCounselor}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
            refreshing={refreshing} // Display the refreshing indicator
            onRefresh={onRefresh} // Handle the pull-to-refresh action
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Boost;