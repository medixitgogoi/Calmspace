import { View, Animated, StatusBar } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useEffect, useRef } from 'react';
import { useNavigation } from '@react-navigation/native';

const Splashscreen = () => {

    const navigation = useNavigation();
    const animations = Array.from({ length: 9 }, () => useRef(new Animated.ValueXY({ x: 0, y: 0 })).current);
    const logoScale = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        animations.forEach((anim) => {
            const loopAnimation = () => {
                Animated.loop(
                    Animated.sequence([
                        Animated.timing(anim, { toValue: { x: Math.random() * 6 - 3, y: Math.random() * 6 - 3 }, duration: 100, useNativeDriver: true }),
                        Animated.timing(anim, { toValue: { x: 0, y: 0 }, duration: 100, useNativeDriver: true })
                    ])
                ).start();
            };
            loopAnimation();
        });

        Animated.loop(
            Animated.sequence([
                Animated.timing(logoScale, { toValue: 1.2, duration: 500, useNativeDriver: true }),
                Animated.timing(logoScale, { toValue: 1, duration: 500, useNativeDriver: true })
            ])
        ).start();

        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true
        }).start();

        const timer = setTimeout(() => {
            navigation.navigate('OnboardingScreen');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <LinearGradient colors={["#86c9c9", "#d8f5f4"]} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <StatusBar hidden={true} />

            <View style={{ width: 150, height: 130, marginLeft: 30, marginBottom: 30 }}>
                <Animated.Image
                    source={require('../assets/logoback.png')}
                    style={{ width: '80%', height: '100%', resizeMode: 'contain', marginBottom: 20, transform: [{ scale: logoScale }], opacity: fadeAnim, borderRadius: 20 }}
                />
            </View>

            <View style={{ flexDirection: 'row' }}>
                {"Calmpsace".split('').map((char, index) => (
                    <Animated.Text key={index} style={{ fontFamily: 'Poppins-Bold', fontSize: 26, fontWeight: '600', color: '#5db7b7', letterSpacing: 8, transform: animations[index].getTranslateTransform(), opacity: fadeAnim }}>
                        {char}
                    </Animated.Text>
                ))}
            </View>
        </LinearGradient>
    );
};

export default Splashscreen;