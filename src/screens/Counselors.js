import { View, Text, FlatList, Image, ScrollView, TouchableOpacity, StatusBar, Dimensions, Animated } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primary, secondary, background } from '../utils/colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import SlidableSection from '../components/SlidableSection';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useState, useRef, useCallback } from 'react';
import { fetchCounselors } from '../utils/fetchCounselors';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const CounselorCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('CounselorDetails', { counselor: item })}
      style={{ backgroundColor: '#fcfcfc', padding: 12, borderRadius: 22, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2, overflow: 'hidden' }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 15 }}>
        {/* Image and name */}
        <View style={{ flex: 0.7, backgroundColor: '#dbf4f4', borderRadius: 20 }}>
          {/* Image */}
          <View style={{ width: '100%', aspectRatio: 1 }}>
            {/* Counselor Image */}
            <Image
              source={{ uri: item?.counselorId?.pic }}
              style={{ width: '100%', height: '100%', borderRadius: 18 }}
              resizeMode='cover'
            />

            {/* Gender Icon */}
            {item?.counselorId?.gender && (
              <View
                style={{
                  position: 'absolute',
                  top: 1,
                  left: 0,
                  backgroundColor: secondary,
                  borderRadius: 40,
                  padding: 4,
                }}
              >
                <Icon
                  name={item.counselorId.gender === 'Male' ? 'mars' : 'venus'}
                  size={18}
                  color="#000"
                />
              </View>
            )}
          </View>

          {/* Name */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center', marginVertical: 5, marginHorizontal: 4 }}>
            <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>{item?.counselorId?.name}</Text>
          </View>
        </View>

        {/* Details */}
        <View style={{ flex: 1, gap: 10 }}>
          {/* Specialties */}
          <View style={{ flexDirection: 'column', gap: 6, alignItems: 'center', width: '100%' }}>

            <View style={{ backgroundColor: primary, width: '100%', justifyContent: 'center', flexDirection: 'row', paddingVertical: 4, borderRadius: 9, borderColor: primary, borderWidth: 0.5 }}>
              <Ionicons name="medkit" size={17} color={'#fff'} style={{ marginRight: 5 }} />

              <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-SemiBold', color: '#fff' }}>Expertise</Text>
            </View>

            <View style={{ gap: 6, flexDirection: 'row', flexWrap: 'wrap', width: '100%', justifyContent: 'flex-start' }}>
              {item?.speciality?.map((specialty, index) => (
                <View key={index} style={{ backgroundColor: '#c2ecec', borderRadius: 7, paddingHorizontal: 8, paddingVertical: 1 }}>
                  <Text style={{ fontSize: responsiveFontSize(1.4), fontFamily: 'Poppins-Medium', color: '#000', paddingTop: 3 }}>✔ {specialty}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Budget */}
      <LinearGradient
        colors={[secondary, '#c2e9fb']} // example gradient
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={{ borderRadius: 100, paddingVertical: 6, paddingHorizontal: 12, marginTop: 8 }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, justifyContent: 'center' }}>
          <Ionicons name="wallet" size={17} color="#000" />

          <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Regular', color: '#000', paddingTop: 3 }}>
            Get it at just <Text style={{ fontFamily: 'Poppins-Bold', fontSize: responsiveFontSize(2) }}>₹{item?.priceId?.video}</Text>
          </Text>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const PreferredCounselorCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('CounselorDetails', { counselor: item })}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 15,
        backgroundColor: '#fcfcfc',
        padding: 11,
        borderRadius: 20,
        marginBottom: 10,
        alignSelf: 'center',
        width: width - 10,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2
      }}
    >
      {/* Image */}
      <View style={{ width: 100, height: 120, borderRadius: 20, overflow: 'hidden' }}>
        <Image
          source={{ uri: item?.counselorId?.pic }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      {/* Details */}
      <View style={{ gap: 8 }}>
        {/* Name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="person" size={17} color="#000" />
          <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>{item?.counselorId?.name}</Text>
        </View>

        {/* Specialties */}
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start', width: '100%' }}>
          <Ionicons name="medkit" size={17} color={'#000'} style={{ marginTop: 2 }} />

          <View style={{ gap: 6, flexDirection: 'row', flexWrap: 'wrap', width: '72%' }}>
            {item.speciality.map((specialty, index) => (
              <View key={index} style={{ backgroundColor: primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 1 }}>
                <Text style={{ fontSize: responsiveFontSize(1.4), fontFamily: 'Poppins-Medium', color: '#fff', paddingTop: 3 }}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Language */}
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start', width: '100%' }}>
          <Ionicons name="chatbubble-ellipses" size={17} color={'#000'} style={{ marginTop: 2 }} />

          <View style={{ gap: 6, flexDirection: 'row', flexWrap: 'wrap', width: '72%' }}>
            {item.languages.map((lang, index) => (
              <View key={index} style={{ backgroundColor: primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 1 }}>
                <Text style={{ fontSize: responsiveFontSize(1.4), fontFamily: 'Poppins-Medium', color: '#fff', paddingTop: 3 }}>{lang}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Price */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="wallet" size={17} color="#000" />
          <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-SemiBold', color: primary, paddingTop: 3 }}>{item?.priceId?.video}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Counselors = ({ navigation }) => {

  const userDetails = useSelector(state => state.user);

  const authToken = userDetails?.authToken;

  const [counselors, setCounselors] = useState(null);
  const [preferredCounselors, setPreferredCounselors] = useState(null);

  const [loading, setLoading] = useState(true);
  const [counselorsLoading, setCounselorsLoading] = useState(false);

  // Function to update the counselors list (Passed to SlidableSection)
  const handleListUpdate = (data) => {
    setPreferredCounselors(data);
    setCounselorsLoading(false);
  };

  // Fetch counselors
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await fetchCounselors(authToken); // Fetch all counselors

          setCounselors(data);

        } catch (error) {
          console.log('Error fetching features: ', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      // If you want cleanup logic, you can return a function here.
      return () => { };

    }, [authToken]) // Include dependencies
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: background }}>
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

          <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>Find Your Counselor</Text>

          <View style={{ width: 35, height: 35 }}></View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

          {/* Preferred counselors */}
          {counselorsLoading ? (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingVertical: 30 }}>
              <ActivityIndicator size="large" color={primary} />
            </View>
          ) : preferredCounselors ? (
            <View style={{ paddingHorizontal: 0 }}>
              {/* Headline with new icon */}
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
                justifyContent: 'center',
                backgroundColor: '#beebeb',
                borderRadius: 13,
                paddingVertical: 7,
                marginHorizontal: 10
              }}>
                <MaterialCommunityIcons name="account-star-outline" size={20} color="#000" style={{ marginRight: 8 }} />
                <Text style={{
                  fontFamily: 'Poppins-SemiBold',
                  fontSize: responsiveFontSize(1.9),
                  color: '#000',
                  textTransform: 'capitalize',
                  letterSpacing: 0.5,
                  paddingTop: 3
                }}>
                  Your Matched <Text style={{ color: primary }}>Counselors</Text>
                </Text>
              </View>

              <FlatList
                data={preferredCounselors}
                keyExtractor={(item) => item?.id}
                renderItem={({ item }) => <PreferredCounselorCard item={item} navigation={navigation} />}
                horizontal
                showsHorizontalScrollIndicator={true}
                contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 5, gap: 15 }}
              />

            </View>
          ) : (
            <SlidableSection
              onFinish={handleListUpdate}
              setCounselorsLoading={setCounselorsLoading}
              counselors={counselors}
            />
          )}

          {/* Or */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
            <Text style={{ marginHorizontal: 10, fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(1.8), color: '#888' }}>Or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
          </View>

          {/* Heading */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 16 }}>
            <MaterialCommunityIcons name="book-search-outline" size={30} color={primary} style={{ marginRight: 8 }} />

            <Text style={{ fontSize: responsiveFontSize(1.7), fontFamily: 'Poppins-Medium', color: '#333', flex: 1 }}>
              Browse through our list of expert counselors and book a session that fits your needs.
            </Text>
          </View>

          {/* Counselor Flatlist */}
          <FlatList
            data={counselors}
            keyExtractor={(item) => item?._id}
            renderItem={({ item }) => <CounselorCard item={item} navigation={navigation} />}
            scrollEnabled={false}
            contentContainerStyle={{ paddingHorizontal: 10, paddingTop: 1 }}
          />
        </ScrollView>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Counselors;