import { View, Text, TouchableOpacity, Dimensions, Animated, TextInput } from 'react-native';
import { useState, useRef } from 'react';
import { primary, lightPrimary } from '../utils/colors';
import { responsiveFontSize, responsiveHeight } from 'react-native-responsive-dimensions';
import LinearGradient from 'react-native-linear-gradient';
import Icon4 from 'react-native-vector-icons/dist/AntDesign';
import Toast from 'react-native-toast-message';

const { width: screenWidth } = Dimensions.get('window');

const SlidableSection = ({ onFinish, setCounselorsLoading, counselors }) => {

    const slideAnim = useRef(new Animated.Value(0)).current;

    const [currentSlide, setCurrentSlide] = useState(0);

    const [gender, setGender] = useState(null);

    const [age, setAge] = useState('');

    const [minBudget, setMinBudget] = useState(null);
    const [maxBudget, setMaxBudget] = useState(null);

    const [language, setLanguage] = useState(null);

    const [data, setData] = useState(null);

    const budgetHandler = () => {

        const min = Number(minBudget); // Convert to number
        const max = Number(maxBudget); // Convert to number

        if (isNaN(min) || isNaN(max)) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Budget',
                text2: 'Please enter valid numbers',
                position: 'top',
                topOffset: 40,
            });
            return;
        }

        if (min < 500) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Budget',
                text2: 'Minimum budget cannot be less than 500',
                position: 'top',
                topOffset: 40,
            });
            return;
        }

        if (max > 2000) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Budget',
                text2: 'Maximum budget cannot be greater than 2000',
                position: 'top',
                topOffset: 40,
            });
            return;
        }

        if (max < min) {
            Toast.show({
                type: 'error',
                text1: 'Invalid Budget',
                text2: 'Maximum budget cannot be less than the minimum budget',
                position: 'top',
                topOffset: 40,
            });
            return;
        }

        nextHandler();
    };

    const nextHandler = () => {
        if (currentSlide < 3) { // 4 slides in total
            setCurrentSlide(prev => prev + 1);

            Animated.timing(slideAnim, {
                toValue: -(currentSlide + 1) * screenWidth, // Move to the next slide dynamically
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    };

    const finishHandler = async () => {

        setCounselorsLoading(true); // Start loading before fetching data

        try {
            // Ensure minBudget and maxBudget are numbers
            const min = Number(minBudget);
            const max = Number(maxBudget);

            // Filter counselors within budget
            const withinRange = counselors.filter(c => {
                const price = c?.priceId?.video;
                return price >= min && price <= max;
            });

            // Filter counselors outside budget
            const outsideRange = counselors.filter(c => {
                const price = c?.priceId?.video;
                return price < min || price > max;
            });

            // Shuffle arrays to ensure randomness
            const shuffle = arr => arr.sort(() => Math.random() - 0.5);

            const selectedData = [
                ...shuffle(withinRange).slice(0, 3),
                ...shuffle(outsideRange).slice(0, 2)
            ];

            setData(selectedData);
            onFinish(selectedData); // Send data to parent

        } catch (error) {
            console.error('Error fetching data:', error);
            onFinish([]); // Return empty array in case of error
        }
    };


    return (
        <View style={{ paddingBottom: 10 }}>
            {/* Heading */}
            <Text style={{ marginHorizontal: 10, fontSize: responsiveFontSize(2), fontFamily: 'Poppins-SemiBold', marginBottom: 10, textAlign: 'center', color: '#444' }}>Find counselors based on your preference</Text>

            {/* Slides */}
            <Animated.View style={{ flexDirection: 'row', width: screenWidth * 4, transform: [{ translateX: slideAnim }] }}>
                {/* Slide 1 - Gender */}
                <View style={{ width: screenWidth, paddingHorizontal: 10, flexDirection: 'column' }}>
                    <View style={{ backgroundColor: '#ade6e6', padding: 20, borderRadius: 15 }}>
                        <Text style={{ fontSize: responsiveFontSize(2.1), fontFamily: 'Poppins-SemiBold', marginBottom: 10 }}>Select your gender</Text>

                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => setGender('Male')} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 20 }}>
                                <View style={{ height: 18, width: 18, borderRadius: 10, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                                    {gender === 'Male' && <View style={{ height: 9, width: 9, borderRadius: 5, backgroundColor: '#000' }} />}
                                </View>

                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: responsiveFontSize(1.9), paddingTop: 2 }}>Male</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => setGender('Female')} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ height: 18, width: 18, borderRadius: 10, borderWidth: 2, borderColor: '#000', justifyContent: 'center', alignItems: 'center', marginRight: 5 }}>
                                    {gender === 'Female' && <View style={{ height: 9, width: 9, borderRadius: 5, backgroundColor: '#000' }} />}
                                </View>

                                <Text style={{ fontFamily: 'Poppins-Medium', fontSize: responsiveFontSize(1.9), paddingTop: 2 }}>Female</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    <LinearGradient
                        colors={gender ? [primary, lightPrimary] : ['#ccc', '#aaa']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ marginTop: 20, borderRadius: 12, elevation: 2, width: '97%', alignSelf: 'center' }}
                    >
                        <TouchableOpacity
                            disabled={!gender}
                            onPress={nextHandler}
                            style={{ gap: 5, height: responsiveHeight(5.8), borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        >
                            <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', paddingtop: 2, opacity: gender ? 1 : 0.9 }}>
                                Next
                            </Text>

                            <Icon4 name="arrowright" size={23} color={gender ? '#fff' : '#ddd'} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* Slide 2 - Age */}
                <View style={{ width: screenWidth, paddingHorizontal: 10, flexDirection: 'column' }}>
                    {/* Heading */}
                    <View style={{ backgroundColor: '#ade6e6', padding: 20, borderRadius: 15 }}>
                        <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-SemiBold', marginBottom: 5 }}>Enter your age</Text>

                        <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, alignItems: 'center', flexDirection: 'row' }}>
                            <TextInput
                                selectionColor={'#555'}
                                placeholder='Enter age'
                                placeholderTextColor={'#888'}
                                value={age}
                                onChangeText={(text) => {
                                    setAge(text);
                                    console.log('age: ', age)
                                }}
                                keyboardType='numeric'
                                style={{ width: '100%', borderRadius: 10, color: '#000', fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(1.9) }}
                            />
                        </View>
                    </View>

                    <LinearGradient
                        colors={age ? [primary, lightPrimary] : ['#ccc', '#aaa']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ marginTop: 20, borderRadius: 12, elevation: 2, width: '97%', alignSelf: 'center' }}
                    >,
                        <TouchableOpacity
                            disabled={!age}
                            onPress={nextHandler}
                            style={{ gap: 5, height: responsiveHeight(5.8), borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        >
                            <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', opacity: age ? 1 : 0.9, paddingTop: 2 }}>
                                Next
                            </Text>

                            <Icon4 name="arrowright" size={23} color={age ? '#fff' : '#ddd'} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* Slide 3 - Budget */}
                <View style={{ width: screenWidth, paddingHorizontal: 10, flexDirection: 'column' }}>

                    <View style={{ backgroundColor: '#ade6e6', padding: 20, borderRadius: 15 }}>
                        {/* Headline */}
                        <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-SemiBold', marginBottom: 10 }}>
                            Enter your budget
                        </Text>

                        {/* Min & Max Budget Inputs Side by Side */}
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                            {/* Min Budget Input */}
                            <View style={{ flex: 1, height: responsiveHeight(5.5), backgroundColor: '#eaf9f9', borderWidth: 1, borderColor: '#555', gap: 2, borderRadius: 12, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'flex-start' }}>

                                <View style={{ height: '92%', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: responsiveFontSize(2.6), fontFamily: 'Poppins-SemiBold' }}>₹</Text>
                                </View>

                                <TextInput
                                    selectionColor={'#000'}
                                    placeholder='Min Budget'
                                    placeholderTextColor={'#888'}
                                    value={minBudget}
                                    onChangeText={(text) => setMinBudget(text)}
                                    keyboardType='numeric'
                                    style={{ height: '100%', color: '#000', fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2.1), width: '95%' }}
                                />
                            </View>

                            {/* Max Budget Input */}
                            <View style={{ flex: 1, backgroundColor: '#eaf9f9', borderWidth: 1, borderColor: '#555', gap: 2, borderRadius: 12, paddingHorizontal: 10, flexDirection: 'row', alignItems: 'center' }}>
                                <View style={{ height: '92%', flexDirection: 'row', alignItems: 'center' }}>
                                    <Text style={{ fontSize: responsiveFontSize(2.6), fontFamily: 'Poppins-SemiBold' }}>₹</Text>
                                </View>

                                <TextInput
                                    selectionColor={'#000'}
                                    placeholder='Max Budget'
                                    placeholderTextColor={'#888'}
                                    value={maxBudget}
                                    onChangeText={(text) => setMaxBudget(text)}
                                    keyboardType='numeric'
                                    style={{ height: '100%', color: '#000', fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(2.1), width: '95%' }}
                                />
                            </View>
                        </View>
                    </View>

                    {/* Next button */}
                    <LinearGradient
                        colors={(minBudget && maxBudget) ? [primary, lightPrimary] : ['#ccc', '#aaa']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ marginTop: 20, borderRadius: 12, elevation: 2, width: '97%', alignSelf: 'center' }}
                    >
                        <TouchableOpacity
                            disabled={!minBudget || !maxBudget}
                            onPress={budgetHandler}
                            style={{ gap: 5, height: responsiveHeight(5.8), borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        >
                            <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', opacity: (minBudget && maxBudget) ? 1 : 0.9, paddingTop: 2 }}>
                                Next
                            </Text>

                            <Icon4 name="arrowright" size={23} color={(minBudget && maxBudget) ? '#fff' : '#ddd'} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>

                {/* Slide 4 - Language */}
                <View style={{ width: screenWidth, paddingHorizontal: 10, flexDirection: 'column' }}>

                    <View style={{ backgroundColor: '#ade6e6', padding: 20, borderRadius: 15 }}>
                        <Text style={{ fontSize: responsiveFontSize(2), fontFamily: 'Poppins-SemiBold', marginBottom: 5 }}>Enter your preferred language</Text>

                        <View style={{ borderBottomColor: '#ccc', borderBottomWidth: 1, alignItems: 'center', flexDirection: 'row' }}>
                            <TextInput
                                selectionColor={'#555'}
                                placeholder='Enter language'
                                placeholderTextColor={'#888'}
                                value={language}
                                onChangeText={(text) => {
                                    setLanguage(text);
                                }}
                                style={{ width: '100%', borderRadius: 10, color: '#000', fontFamily: 'Poppins-SemiBold', fontSize: responsiveFontSize(1.9) }}
                            />
                        </View>
                    </View>

                    <LinearGradient
                        colors={language ? [primary, lightPrimary] : ['#ccc', '#aaa']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{ marginTop: 20, borderRadius: 12, elevation: 2, width: '97%', alignSelf: 'center' }}
                    >
                        <TouchableOpacity
                            disabled={!language}
                            onPress={finishHandler}
                            style={{ gap: 5, height: responsiveHeight(5.8), borderRadius: 12, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%' }}
                        >
                            <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', opacity: language ? 1 : 0.9, paddingTop: 2 }}>
                                Finish
                            </Text>

                            <Icon4 name="arrowright" size={23} color={age ? '#fff' : '#ddd'} />
                        </TouchableOpacity>
                    </LinearGradient>
                </View>
            </Animated.View>
        </View>
    );
};

export default SlidableSection;