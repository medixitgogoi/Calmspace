import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { primary, secondary } from '../utils/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import { fetchBlogs } from '../utils/fetchBlogs';
import Icon from 'react-native-vector-icons/FontAwesome';
import ShimmerPlaceHolder from 'react-native-shimmer-placeholder';
import LinearGradient from 'react-native-linear-gradient';
import { useSelector } from 'react-redux';

const Blogs = ({ navigation }) => {

    const userDetails = useSelector(state => state.user);

    const authToken = userDetails?.authToken;

    const [loading, setLoading] = useState(true);

    const [blogs, setBlogs] = useState(null);

    // Fetch data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await fetchBlogs(authToken); // Fetch all questions
                console.log('blogs: ', data);

                setBlogs(data);

            } catch (error) {
                console.log('Error fetching features: ', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const getTimeAgo = (dateString) => {
        if (!dateString) return 'Some time ago';

        const parts = dateString.split('/');
        if (parts.length !== 3) return 'Invalid date format';

        const [day, month, year] = parts.map(Number);
        if (isNaN(day) || isNaN(month) || isNaN(year)) return 'Invalid date values';

        const createdAt = new Date(year, month - 1, day);
        const now = new Date();

        const diffTime = now - createdAt;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
        const diffMonths = Math.floor(diffDays / 30);
        const diffYears = Math.floor(diffDays / 365);

        if (diffTime < 0) return 'In the future';
        if (diffYears > 0) return `${diffYears} years ago`;
        if (diffMonths > 0) return `${diffMonths} months ago`;
        return diffDays === 0 ? 'Today' : `${diffDays}d ago`;
    };

    return (
        <View style={{ marginTop: 15 }}>

            {/* Headline */}
            <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 10, marginHorizontal: 10 }}>
                <Ionicons name="happy-outline" size={24} color="#2D9596" style={{ marginRight: 5 }} />

                <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-Bold' }}>
                    Mental Health Blogs
                </Text>
            </View>

            {loading ? (
                <FlatList
                    data={[1, 2, 3, 4]}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.toString()}
                    contentContainerStyle={{ paddingHorizontal: 10 }}
                    renderItem={() => (
                        <View style={{ width: 220, height: 300, backgroundColor: '#f0f0f0', borderRadius: 16, paddingVertical: 15, paddingHorizontal: 12, marginRight: 15 }}>
                            <ShimmerPlaceHolder
                                LinearGradient={LinearGradient}
                                style={{ width: '100%', height: 130, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                                shimmerStyle={{ borderRadius: 16 }}
                            />
                            <View style={{ paddingHorizontal: 10, marginTop: 10 }}>
                                <ShimmerPlaceHolder LinearGradient={LinearGradient} style={{ width: 100, height: 18, borderRadius: 8, marginBottom: 6 }} />
                                <ShimmerPlaceHolder LinearGradient={LinearGradient} style={{ width: '90%', height: 14, borderRadius: 8, marginBottom: 4 }} />
                                <ShimmerPlaceHolder LinearGradient={LinearGradient} style={{ width: '60%', height: 14, borderRadius: 8 }} />
                            </View>
                        </View>
                    )}
                />
            ) : (
                <View style={{ paddingVertical: 10 }}>
                    <FlatList
                        data={blogs}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item, idx) => idx}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={{
                                    width: 200,
                                    backgroundColor: '#f9f5e9',
                                    borderRadius: 16,
                                    marginRight: 15,
                                    paddingBottom: 15, // ✅ Add paddingBottom here
                                }}
                                onPress={() => navigation.navigate('BlogDetails', { data: item })}
                            >
                                {/* Blog Image */}
                                <Image
                                    source={require('../assets/blog.jpg')}
                                    style={{ width: '100%', height: 130, borderTopLeftRadius: 16, borderTopRightRadius: 16 }}
                                />

                                {/* Blog Tag */}
                                <View
                                    style={{
                                        backgroundColor: primary,
                                        alignSelf: 'flex-start',
                                        paddingHorizontal: 10,
                                        paddingVertical: 3,
                                        borderRadius: 8,
                                        marginLeft: 10,
                                        marginTop: 10,
                                        paddingTop: 5,
                                    }}
                                >
                                    <Text style={{ fontSize: responsiveFontSize(1.4), color: '#fff', fontFamily: 'Poppins-Medium', textTransform: 'uppercase' }}>{item?.type}</Text>
                                </View>

                                {/* Blog Content */}
                                <View style={{ paddingHorizontal: 10, marginTop: 8 }}>
                                    <Text style={{ fontSize: responsiveFontSize(1.8), fontFamily: 'Poppins-SemiBold', color: '#154360' }}>{item.title}</Text>
                                </View>

                                {/* Author & Time */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 10 }}>
                                    <Text style={{ fontSize: responsiveFontSize(1.4), color: '#154360', fontFamily: 'Poppins-Medium' }}>
                                        An {item?.category} published by{' '}
                                        <Text style={{ fontFamily: 'Poppins-SemiBold', color: primary }}>{item?.author}</Text> {item?.designation}
                                    </Text>
                                </View>

                                {/* Time */}
                                <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, marginTop: 5 }}>
                                    <Icon name="clock-o" size={16} color={'#555'} style={{ marginRight: 4 }} />
                                    <Text style={{ color: '#555', fontSize: responsiveFontSize(1.4), fontFamily: 'Poppins-Regular', paddingTop: 3 }}>
                                        {getTimeAgo(item?.createdAt)}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        )}
                    />
                </View>

            )}
        </View>
    );
};

export default Blogs;