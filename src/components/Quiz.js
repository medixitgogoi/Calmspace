import React, { useEffect, useRef } from 'react';
import { Animated, Image, Text, TouchableOpacity, View } from 'react-native';
import { background, primary, secondary } from '../utils/colors';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const Quiz = () => {

    const navigation = useNavigation();

    const scaleAnim = useRef(new Animated.Value(1)).current; // Initial scale is 1

    useEffect(() => {
        const startScaling = () => {
            Animated.loop(
                Animated.sequence([
                    Animated.timing(scaleAnim, {
                        toValue: 0.95, // Shrinks a little
                        duration: 500,
                        useNativeDriver: true,
                    }),
                    // Animated.timing(scaleAnim, {
                    //     toValue: 1.05, // Expands a little
                    //     duration: 500,
                    //     useNativeDriver: true,
                    // }),
                    Animated.timing(scaleAnim, {
                        toValue: 1, // Returns to normal size
                        duration: 500,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        startScaling();
    }, []);

    return (
        <LinearGradient
            colors={['#ebdab1', '#F5EDD9']}
            style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 10,
                borderRadius: 20,
                borderColor: primary,
                borderWidth: 1,
                justifyContent: 'space-between',
                paddingVertical: 15,
                marginHorizontal: 10
            }}
        >
            {/* Left Side - Image */}
            <View style={{ width: '40%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Image
                    source={require('../assets/quiz.png')}
                    style={{ width: '100%', height: 100, marginRight: 15 }}
                    resizeMode="cover"
                />
            </View>

            {/* Right Side - Text & Button */}
            <View style={{ width: '60%', flexDirection: 'column', justifyContent: 'space-between', gap: 15 }}>
                <Text style={{ fontSize: responsiveFontSize(1.6), color: '#333', fontFamily: 'Poppins-SemiBold', textAlign: 'center' }}>
                    Take a short quiz to check your mental well-being.
                </Text>

                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                    <TouchableOpacity
                        onPress={() => navigation.navigate('QuizQuestions')}
                        style={{
                            backgroundColor: '#2D9596',
                            paddingVertical: 12,
                            borderRadius: 50,
                            alignItems: 'center',
                            paddingHorizontal: 15,
                            borderColor: background,
                            borderWidth: 1.5
                        }}
                    >
                        <Text style={{ color: secondary, fontFamily: 'Poppins-Medium', fontSize: responsiveFontSize(1.8) }}>Start the Quiz</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </LinearGradient>
    );
};

export default Quiz;
