import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Image, FlatList, Animated, Dimensions } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { primary } from '../utils/colors';
import LinearGradient from 'react-native-linear-gradient';
import { fetchFeatures } from '../utils/fetchFeatures';
import { createShimmerPlaceholder } from 'react-native-shimmer-placeholder';

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient)

const { width } = Dimensions.get('window');
const ITEM_WIDTH = width * 0.70;
const SPACING = 10;

const Features = () => {

    const scrollX = useRef(new Animated.Value(0)).current;
    const flatListRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [features, setFeatures] = useState([]);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchFeatures();
                setFeatures(data);
            } catch (error) {
                console.log('Error fetching features: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <View style={{ marginTop: 25 }}>
            {/* Title */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, paddingLeft: 10 }}>
                <Ionicons name="time-outline" size={24} color="#2D9596" style={{ marginRight: 5 }} />
                <Text style={{ fontSize: responsiveFontSize(2.1), fontFamily: 'Poppins-Bold' }}>Upcoming Features</Text>
            </View>

            {loading ? (
                // Show shimmer placeholders while loading
                <FlatList
                    data={[1, 2, 3]} // Placeholder items
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={{ paddingHorizontal: 12 }}
                    renderItem={() => (
                        <View style={{ width: 300, alignItems: 'center', marginRight: 15 }}>
                            <ShimmerPlaceholder
                                shimmerColors={['#e1f6f6', '#a4e3e4', '#e1f6f6']}
                                visible={false} // Ensure it's shimmering
                                style={{ width: '100%', height: 200, borderRadius: 15, marginBottom: 10 }}
                            />
                        </View>
                    )}
                />
            ) : (
                // Render actual features when data is available
                <Animated.FlatList
                    ref={flatListRef}
                    data={features}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    snapToAlignment="center"
                    snapToInterval={ITEM_WIDTH + SPACING}
                    decelerationRate="fast"
                    keyExtractor={(_, index) => index.toString()}
                    contentContainerStyle={{ paddingHorizontal: SPACING }}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    scrollEventThrottle={16}
                    renderItem={({ item, index }) => {
                        const inputRange = [
                            (index - 1) * ITEM_WIDTH,
                            index * ITEM_WIDTH,
                            (index + 1) * ITEM_WIDTH,
                        ];

                        const scale = scrollX.interpolate({
                            inputRange,
                            outputRange: [0.75, 1, 0.75],
                            extrapolate: 'clamp',
                        });

                        return (
                            <Animated.View style={{ transform: [{ scale }], width: ITEM_WIDTH }}>
                                <LinearGradient
                                    colors={['#e1f6f6', '#a4e3e4']}
                                    start={{ x: 0, y: 0 }}
                                    end={{ x: 1, y: 1 }}
                                    style={{ borderRadius: 20, padding: 20, alignItems: 'center', borderColor: primary, borderWidth: 0 }}
                                >
                                    <Image source={{ uri: item.imgSrc }} style={{ width: 100, height: 100 }} />

                                    <Text style={{ fontSize: responsiveFontSize(2), fontWeight: '600', textAlign: 'center', marginTop: 10, fontFamily: 'Poppins-SemiBold' }}>
                                        {item.title}
                                    </Text>

                                    <Text style={{ fontSize: responsiveFontSize(1.5), color: '#666', textAlign: 'center', marginTop: 0, fontFamily: 'Poppins-Medium' }}>
                                        {item.subtitle}
                                    </Text>
                                </LinearGradient>
                            </Animated.View>
                        );
                    }}
                />
            )}
        </View>
    );
};

export default Features;