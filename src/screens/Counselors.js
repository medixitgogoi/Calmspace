import { View, Text, FlatList, Image, ScrollView, TouchableOpacity, StatusBar, Animated, Dimensions } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primary, secondary, background } from '../utils/colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import SlidableSection from '../components/SlidableSection';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEffect, useState, useRef } from 'react';
import { fetchCounselors } from '../utils/fetchCounselors';

const { width } = Dimensions.get('window');

const counselors = [
  {
    id: '1',
    name: 'Dr. Aarav Mehta',
    specialties: ['Anxiety', 'Stress'],
    languages: ['English', 'Hindi', 'Assamese'],
    budget: '₹500/hr',
    image: 'https://via.placeholder.com/150',
    education: 'M.A. in Clinical Psychology from Delhi University',
    therapy: 'Focuses on helping individuals manage anxiety and stress through cognitive behavioral techniques and mindfulness practices.',
    info: 'Provides a safe and supportive space for clients to explore personal challenges and develop effective coping strategies.',
    expertise: 'Dr. Aarav specializes in anxiety and stress management. With years of experience, he guides clients through evidence-based practices to help them regain control and improve emotional well-being.'
  },
  {
    id: '2',
    name: 'Dr. Sanya Kapoor',
    specialties: ['Depression', 'Mood Disorders'],
    languages: ['English', 'Hindi', 'Bengali'],
    budget: '₹600/hr',
    image: 'https://via.placeholder.com/150',
    education: 'M.Sc. in Counseling Psychology from Mumbai University',
    therapy: 'Uses integrative therapy techniques to assist clients dealing with depression and mood instability, promoting resilience and hope.',
    info: 'Dr. Sanya works with individuals struggling with emotional lows and fluctuating moods to restore mental balance and self-awareness.',
    expertise: 'She offers compassionate support for clients with depression and mood disorders, tailoring treatment plans to each individual’s unique experience and emotional needs.'
  },
  {
    id: '3',
    name: 'Dr. Rohan Sharma',
    specialties: ['Relationship Issues'],
    languages: ['English', 'Urdu', 'Assamese'],
    budget: '₹550/hr',
    image: 'https://via.placeholder.com/150',
    education: 'M.A. in Marriage and Family Therapy from TISS',
    therapy: 'Helps individuals and couples improve communication, rebuild trust, and navigate emotional conflicts in relationships.',
    info: 'Dr. Rohan creates a judgment-free space where relationship dynamics are explored and strengthened through empathy and understanding.',
    expertise: 'With a focus on relationship counseling, he supports clients through difficult emotional journeys, offering guidance on conflict resolution, emotional intimacy, and healthy attachment styles.'
  },
  {
    id: '4',
    name: 'Dr. Nisha Verma',
    specialties: ['PTSD', 'Trauma', 'Stress'],
    languages: ['English', 'French', 'Assamese'],
    budget: '₹650/hr',
    image: 'https://via.placeholder.com/150',
    education: 'Ph.D. in Trauma Psychology from BHU',
    therapy: 'Utilizes trauma-informed approaches and EMDR techniques to help clients process and heal from past traumatic experiences.',
    info: 'Offers empathetic therapy for those suffering from PTSD and trauma, supporting them in rebuilding a sense of safety and confidence.',
    expertise: 'Dr. Nisha is highly skilled in trauma recovery. She works with clients dealing with PTSD, guiding them through safe and structured healing processes to overcome past wounds and restore emotional resilience.'
  },
  {
    id: '5',
    name: 'Dr. Kabir Iyer',
    specialties: ['Addiction', 'Rehabilitation'],
    languages: ['English', 'Hindi', 'Chinese'],
    budget: '₹700/hr',
    image: 'https://via.placeholder.com/150',
    education: 'M.Sc. in Addiction Studies from NIMHANS',
    therapy: 'Specializes in addiction recovery through structured programs and motivational interviewing, promoting long-term behavioral change.',
    info: 'Supports individuals struggling with substance abuse, helping them rebuild lives with healthier coping mechanisms and strong support systems.',
    expertise: 'With deep knowledge in addiction treatment, Dr. Kabir provides intensive rehabilitation therapy focused on recovery, relapse prevention, and personal empowerment for individuals overcoming substance dependence.'
  },
  {
    id: '6',
    name: 'Dr. Priya Desai',
    specialties: ['Child Psychology', 'Developmental Disorders'],
    languages: ['English', 'Hindi', 'Marathi'],
    budget: '₹600/hr',
    image: 'https://via.placeholder.com/150',
    education: 'M.A. in Child Psychology from SNDT Women’s University',
    therapy: 'Helps children cope with developmental challenges through play therapy and behavior intervention techniques.',
    info: 'Works with children and families to address learning disabilities, autism spectrum issues, and emotional regulation.',
    expertise: 'Dr. Priya specializes in child psychology. Her work includes structured programs for developmental delays, helping children grow emotionally and socially while also guiding parents with effective parenting strategies.'
  },
  {
    id: '7',
    name: 'Dr. Manav Joshi',
    specialties: ['Grief Counseling', 'Loss and Healing'],
    languages: ['English', 'Gujarati', 'Hindi'],
    budget: '₹500/hr',
    image: 'https://via.placeholder.com/150',
    education: 'M.A. in Mental Health Counseling from Gujarat University',
    therapy: 'Supports individuals going through grief, loss, or emotional trauma with empathetic and person-centered approaches.',
    info: 'Offers a calming environment where clients can express their emotions and work toward healing after a significant loss.',
    expertise: 'Dr. Manav focuses on grief counseling, helping clients navigate the complex emotional aftermath of loss with care, reflection, and therapeutic tools to regain a sense of peace and purpose.'
  },
  {
    id: '8',
    name: 'Dr. Ayesha Khan',
    specialties: ['Self-Esteem', 'Confidence Building'],
    languages: ['English', 'Hindi', 'Urdu'],
    budget: '₹550/hr',
    image: 'https://via.placeholder.com/150',
    education: 'M.Sc. in Behavioral Science from Jamia Millia Islamia',
    therapy: 'Uses positive psychology and solution-focused strategies to boost self-worth and self-image in clients.',
    info: 'Helps clients discover inner strength and develop the confidence needed to face life’s challenges boldly.',
    expertise: 'Dr. Ayesha empowers clients to improve self-esteem by working on core beliefs, personal goals, and cognitive reframing. Her sessions build resilience, confidence, and a renewed sense of identity.'
  }
];

const CounselorCard = ({ item, navigation }) => {
  return (
    <TouchableOpacity onPress={() => navigation.navigate('CounselorDetails', { counselor: item })} style={{ flexDirection: 'row', alignItems: 'center', gap: 15, backgroundColor: '#fcfcfc', padding: 12, borderRadius: 28, marginBottom: 20, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 }}>

      {/* Image */}
      <View style={{ flex: 0.6, borderRadius: 23, overflow: 'hidden', aspectRatio: 1 }}>
        <Image source={require('../assets/avatar.jpg')} style={{ width: '100%', height: '100%' }} resizeMode='cover' />
      </View>

      {/* Details */}
      <View style={{ flex: 1, gap: 10 }}>
        {/* Name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="person" size={20} color="#000" />
          <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>{item.name}</Text>
        </View>

        {/* Specialties */}
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start', }}>
          <Ionicons name="medkit" size={20} color={'#000'} style={{ marginTop: 2 }} />

          <View style={{ gap: 6, flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.specialties.map((specialty, index) => (
              <View key={index} style={{ backgroundColor: primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 1 }}>
                <Text style={{ fontSize: responsiveFontSize(1.5), fontFamily: 'Poppins-Medium', color: '#fff', paddingTop: 3 }}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Budget */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="wallet" size={20} color="#000" />

          <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-SemiBold', color: primary, paddingTop: 3 }}>{item.budget}</Text>
        </View>

      </View>
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
        padding: 13,
        borderRadius: 28,
        marginRight: 14,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 10,
      }}
    >
      {/* Image */}
      <View style={{ width: 120, height: 120, borderRadius: 20, overflow: 'hidden' }}>
        <Image
          source={require('../assets/avatar.jpg')}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
      </View>

      {/* Details */}
      <View style={{ gap: 8 }}>
        {/* Name */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="person" size={20} color="#000" />
          <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>{item.name}</Text>
        </View>

        {/* Specialties */}
        <View style={{ flexDirection: 'row', gap: 6, alignItems: 'flex-start', }}>
          <Ionicons name="medkit" size={20} color={'#000'} style={{ marginTop: 2 }} />

          <View style={{ gap: 6, flexDirection: 'row', flexWrap: 'wrap' }}>
            {item.specialties.map((specialty, index) => (
              <View key={index} style={{ backgroundColor: primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 1 }}>
                <Text style={{ fontSize: responsiveFontSize(1.5), fontFamily: 'Poppins-Medium', color: '#fff', paddingTop: 3 }}>{specialty}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Language */}
        <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
          <Ionicons name="chatbubble-ellipses" size={20} color={'#000'} style={{ marginTop: 2 }} />

          {item.languages.map((lang, index) => (
            <View key={index} style={{ backgroundColor: primary, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 1 }}>
              <Text style={{ fontSize: responsiveFontSize(1.5), fontFamily: 'Poppins-Medium', color: '#fff', paddingTop: 3 }}>{lang}</Text>
            </View>
          ))}
        </View>

        {/* Budget */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <Ionicons name="wallet" size={20} color="#000" />
          <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-SemiBold', color: primary, paddingTop: 3 }}>{item.budget}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const Counselors = ({ navigation }) => {

  const [currentIndex, setCurrentIndex] = useState(0);

  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) setCurrentIndex(viewableItems[0].index);
  });

  // const [counselors, setCounselors] = useState(null);
  const [preferredCounselors, setPreferredCounselors] = useState(null);

  const [loading, setLoading] = useState(true);
  const [counselorsLoading, setCounselorsLoading] = useState(false);

  // Function to update the counselors list (Passed to SlidableSection)
  const handleListUpdate = (data) => {
    setPreferredCounselors(data);
    setCounselorsLoading(false);
  };

  // Fetch counselors
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCounselors(); // Fetch all counselors
        // console.log('blogs: ', data);

        // setBlogs(data);

      } catch (error) {
        console.log('Error fetching features: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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

          <Text style={{ fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>Find Your Counselor</Text>

          <View style={{ width: 35, height: 35 }}></View>
        </View>

        {/* Content */}
        <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>

          {/* Preferred counselors */}
          {preferredCounselors ? (
            <View style={{ paddingHorizontal: 10 }}>
              {/* Headline with new icon */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, justifyContent: 'center', backgroundColor: '#beebeb', borderRadius: 13, paddingVertical: 7 }}>
                <MaterialCommunityIcons name="account-star-outline" size={22} color="#000" style={{ marginRight: 8 }} />
                <Text style={{ fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2), color: '#000', textTransform: 'capitalize', letterSpacing: 0.5, paddingTop: 3 }}>
                  Your Matched <Text style={{ color: primary }}>Counselors</Text>
                </Text>
              </View>

              <FlatList
                data={preferredCounselors}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <PreferredCounselorCard item={item} navigation={navigation} />}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled // this enables snapping behavior
                onViewableItemsChanged={onViewableItemsChanged.current}
                viewabilityConfig={viewabilityConfig}
                contentContainerStyle={{ paddingHorizontal: 4, paddingVertical: 5 }}
              />

              {/* Dot Indicator */}
              <View style={{ flexDirection: 'row', justifyContent: 'center', marginBottom: 20 }}>
                {preferredCounselors.map((_, index) => (
                  <View
                    key={index}
                    style={{
                      width: 7,
                      height: 7,
                      borderRadius: 4,
                      backgroundColor: index === currentIndex ? '#000' : '#ccc',
                      marginHorizontal: 4,
                    }}
                  />
                ))}
              </View>
            </View>
          ) : (
            <SlidableSection onFinish={handleListUpdate} setCounselorsLoading={setCounselorsLoading} />
          )}

          {/* Or */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, paddingHorizontal: 10 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
            <Text style={{ marginHorizontal: 10, fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(1.8), color: '#888' }}>Or</Text>
            <View style={{ flex: 1, height: 1, backgroundColor: '#ccc' }} />
          </View>

          {/* Heading */}
          <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginBottom: 16 }}>
            <MaterialCommunityIcons name="book-search-outline" size={35} color={primary} style={{ marginRight: 8 }} />

            <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-Medium', color: '#333', flex: 1 }}>
              Browse through our list of expert counselors and book a session that fits your needs.
            </Text>
          </View>

          {/* Counselor Flatlist */}
          <FlatList
            data={counselors}
            keyExtractor={(item) => item.id}
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