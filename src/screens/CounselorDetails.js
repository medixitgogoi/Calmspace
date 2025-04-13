import { View, Text, StatusBar, TouchableOpacity, ScrollView, Image, Dimensions } from 'react-native';
import { useRef, useState } from 'react';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { background, primary } from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';

const { width } = Dimensions.get('window');

const CounselorDetails = ({ navigation, route }) => {

  const { counselor } = route.params;

  const scrollRef = useRef(null);

  const [activeTab, setActiveTab] = useState(0);

  // handleTabPress
  const handleTabPress = (index) => {
    setActiveTab(index);
    scrollRef.current?.scrollTo({ x: width * index, animated: true });
  };

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
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={27} color={'#333'} />
          </TouchableOpacity>
          <Text style={{ fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>Counselor Details</Text>
          <View style={{ width: 35, height: 35 }}></View>
        </View>

        {/* Scrollable Info */}
        <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
          {/* Image & Basic Info */}
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Image source={require('../assets/avatar.jpg')} style={{ width: 150, height: 150, borderRadius: 75 }} />
            <Text style={{ fontSize: responsiveFontSize(2.8), fontFamily: 'Poppins-SemiBold', color: '#000', marginTop: 10 }}>{counselor.name}</Text>
            <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-Medium', color: '#666' }}>{counselor.budget}</Text>
          </View>

          {/* Info */}
          <View style={{ marginVertical: 20 }}>
            {/* Education */}
            <View style={{ backgroundColor: '#e5f7f7', padding: 15, borderRadius: 18, elevation: 2, flexDirection: 'row', marginBottom: 15, marginHorizontal: 20 }}>
              <Ionicons name="school-outline" size={22} color={'#000'} style={{ marginTop: 2 }} />

              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-SemiBold', color: '#000' }}>Education</Text>
                <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', color: '#555' }}>{counselor.education}</Text>
              </View>
            </View>

            {/* Specialties */}
            <View style={{ backgroundColor: '#e5f7f7', padding: 15, borderRadius: 18, elevation: 2, flexDirection: 'row', marginBottom: 15, marginHorizontal: 20 }}>
              <Ionicons name="medkit-outline" size={20} color={'#000'} style={{ marginTop: 2 }} />

              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-SemiBold', color: '#000' }}>Specialties</Text>
                <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', color: '#555' }}>{counselor.specialties.join(', ')}</Text>
              </View>
            </View>

            {/* Languages */}
            <View style={{ backgroundColor: '#e5f7f7', padding: 15, borderRadius: 18, elevation: 2, flexDirection: 'row', marginBottom: 15, marginHorizontal: 20 }}>
              <Ionicons name="chatbubble-ellipses-outline" size={22} color={'#000'} style={{ marginTop: 2 }} />

              <View style={{ paddingLeft: 10, flex: 1 }}>
                <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-SemiBold', color: '#000' }}>Languages</Text>
                <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', color: '#555' }}>{counselor.languages.join(', ')}</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 10, marginTop: 15 }}>
              {['Therapy', 'Info', 'Expertise'].map((tab, index) => (
                <TouchableOpacity key={index} onPress={() => handleTabPress(index)} style={{ borderBottomWidth: activeTab === index ? 2.5 : 0, borderColor: '#333' }}>
                  <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-Bold', color: activeTab === index ? '#000' : '#999' }}>{tab}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Horizontal ScrollView */}
            <ScrollView
              ref={scrollRef}
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              scrollEventThrottle={16}
              onScroll={(e) => {
                const pageIndex = Math.round(e.nativeEvent.contentOffset.x / width);

                setActiveTab(pageIndex);
              }}
              style={{ width }}
              contentContainerStyle={{ paddingHorizontal: 5, paddingVertical: 10 }}
            >
              <View style={{ width, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', color: '#257c7c', textAlign: 'justify' }}>{counselor.therapy}</Text>
              </View>

              <View style={{ width, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', color: '#257c7c', textAlign: 'justify' }}>{counselor.info}</Text>
              </View>

              <View style={{ width, paddingHorizontal: 10 }}>
                <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', color: '#257c7c', textAlign: 'justify' }}>{counselor.expertise}</Text>
              </View>
            </ScrollView>

          </View>

        </ScrollView>

        {/* Schedule Appointment Button */}
        <View style={{
          position: 'absolute',
          bottom: 8,
          left: 10,
          right: 10,
          borderRadius: 30,
          overflow: 'hidden',
          elevation: 6
        }}>
          <TouchableOpacity onPress={() => console.log('Schedule Appointment')} activeOpacity={0.8}>
            <LinearGradient
              colors={['#0fb8ad', '#1fc8db']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 12,
                borderRadius: 30
              }}
            >
              <Ionicons name="calendar-outline" size={22} color="#fff" style={{ marginRight: 8 }} />

              <Text style={{
                fontFamily: 'Poppins-SemiBold',
                fontSize: responsiveFontSize(2.2),
                color: '#fff',
                paddingTop: 5
              }}>
                Schedule Appointment
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default CounselorDetails;