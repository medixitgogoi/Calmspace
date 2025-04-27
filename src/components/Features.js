import { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, Animated, Dimensions, TouchableOpacity } from 'react-native';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { primary } from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { fetchFeatures } from '../utils/fetchFeatures';
import { useSelector } from 'react-redux';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.7;
const SIDE_CARD_WIDTH = width * 0.6;
const SPACING = 20;

// const features = [
//     { title: "AI Chat Support", subtitle: "Instant AI-powered help." },
//     { title: "Mood Tracker", subtitle: "Track and analyze emotions." },
//     { title: "Guided Meditation", subtitle: "Expert-led meditation." },
//     { title: "Personalized Therapy Plans", subtitle: "Get customized help." },
//     { title: "Daily Affirmations", subtitle: "Boost positivity with daily quotes." },
//     { title: "Sleep Sounds", subtitle: "Relaxing sounds for better sleep." },
//     { title: "Therapist Matching", subtitle: "Find the right therapist for you." },
// ];

const Features = () => {

    const userDetails = useSelector(state => state.user);

    const authToken = userDetails?.authToken;

    const [loading, setLoading] = useState(true);
    const [features, setFeatures] = useState([]);

    const scrollX = useRef(new Animated.Value(0)).current;

    // Fetch features
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFeatures(authToken);

                setFeatures(data);
            } catch (error) {
                console.log('Error fetching features: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const renderItem = ({ item, index }) => {

        const inputRange = [
            (index - 1) * (CARD_WIDTH + SPACING),
            index * (CARD_WIDTH + SPACING),
            (index + 1) * (CARD_WIDTH + SPACING)
        ];

        const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.9, 1, 0.9],
            extrapolate: 'clamp'
        });

        return (
            <Animated.View style={{ width: CARD_WIDTH, marginHorizontal: SPACING / 2, transform: [{ scale }] }}>
                <LinearGradient
                    colors={['#e1f6f6', '#a4e3e4']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={{ borderRadius: 20, padding: 20, alignItems: 'center', borderColor: primary, borderWidth: 0 }}
                >
                    <Image source={require('../assets/features.png')} style={{ width: 100, height: 100 }} />

                    <Text style={{ fontSize: responsiveFontSize(2), fontWeight: '600', textAlign: 'center', marginTop: 10, fontFamily: 'Poppins-SemiBold' }}>
                        {item.title}
                    </Text>

                    <Text style={{ fontSize: responsiveFontSize(1.5), color: '#666', textAlign: 'center', marginTop: 0, fontFamily: 'Poppins-Medium' }}>
                        {item.subtitle}
                    </Text>
                </LinearGradient>
            </Animated.View>
        );
    };

    return (
        <View style={{ marginTop: 15 }}>
            {/* Title */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, paddingLeft: 10 }}>
                <Ionicons name="time-outline" size={24} color="#2D9596" style={{ marginRight: 5 }} />
                <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-Bold' }}>Upcoming Features</Text>
            </View>

            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    renderItem={() => (
                        <View style={{ width: 220, height: 220, marginBottom: 20, backgroundColor: '#f0f0f0', borderRadius: 16, paddingVertical: 15, paddingHorizontal: 12, marginRight: 15 }}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ width: '100%', height: '100%', borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                                shimmerStyle={{ borderRadius: 16 }}
                            />
                        </View>
                    )}
                />
            ) : (
                <View style={{ height: responsiveHeight(27), alignItems: 'flex-start', justifyContent: 'center', flexDirection: 'row', paddingTop: 10 }}>
                    <Animated.FlatList
                        data={features}
                        keyExtractor={(item, index) => index.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: (width - CARD_WIDTH) / 2 }}
                        snapToInterval={CARD_WIDTH + SPACING}
                        decelerationRate="fast"
                        renderItem={renderItem}
                        onScroll={Animated.event(
                            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                            { useNativeDriver: true }
                        )}
                        scrollEventThrottle={16}
                    />
                </View>
            )}

        </View>
    );
};

export default Features;