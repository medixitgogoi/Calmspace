import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import Toast from 'react-native-toast-message';
import { useSelector } from 'react-redux';

const AddDetails = ({ navigation }) => {

    const userDetails = useSelector(state => state.user);
    const authToken = userDetails?.authToken;

    const [info, setInfo] = useState('');
    const [expertise, setExpertise] = useState('');
    const [languages, setLanguages] = useState('');
    const [experience, setExperience] = useState('');
    const [degree, setDegree] = useState('');
    const [therapy, setTherapy] = useState('');
    const [speciality, setSpeciality] = useState('');

    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {

        if (!info.trim() || !expertise.trim() || !languages.trim() || !experience.trim() || !degree.trim() || !therapy.trim() || !speciality.trim()) {
            Toast.show({
                type: 'error',
                text1: 'All fields are required',
                text2: 'Please fill up all the fields and try again',
                position: 'top',
                topOffset: 40,
            });

            return;
        }

        setLoading(true);

        const payload = {
            "info": info,
            "expertise": expertise,
            "languages": languages.split(',').map(item => item.trim()),
            "experience": experience,
            "degree": degree,
            "therapy": therapy,
            "speciality": speciality.split(',').map(item => item.trim()),
        };

        try {
            const response = await axios.post('/counselor/update-info', payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                }
            });

            console.log('add details response: ', response);

            if (response?.data?.status_code === 200) {
                Toast.show({
                    type: 'success',
                    text1: 'Details Added Successfully',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: 40,
                });

                navigation.goBack();

            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Failed to add details',
                    text2: response?.data?.message,
                    position: 'top',
                    topOffset: 40,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Failed to add details',
                text2: 'Please try again',
                position: 'top',
                topOffset: 40,
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                <StatusBar barStyle="dark-content" backgroundColor="#ecf9f9" />

                {/* Keyboard Avoider */}
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={{ flex: 1 }}
                    keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
                >
                    <View style={{ flex: 1, paddingHorizontal: 8 }}>

                        {/* Header */}
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                            <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Ionicons name="arrow-back" size={25} color={'#333'} />
                            </TouchableOpacity>

                            <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>
                                Add Details
                            </Text>

                            <View style={{ width: 35, height: 35 }} />
                        </View>

                        {/* Form */}
                        <ScrollView
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
                            keyboardShouldPersistTaps="handled"
                        >
                            {[
                                { label: 'Info', value: info, setter: setInfo },
                                { label: 'Expertise', value: expertise, setter: setExpertise },
                                { label: 'Languages', value: languages, setter: setLanguages },
                                { label: 'Experience', value: experience, setter: setExperience },
                                { label: 'Degree', value: degree, setter: setDegree },
                                { label: 'Therapy', value: therapy, setter: setTherapy },
                                { label: 'Speciality', value: speciality, setter: setSpeciality },
                            ].map((field, index) => (
                                <View key={index} style={{ marginBottom: 20 }}>
                                    <Text style={{
                                        fontSize: responsiveFontSize(1.9),
                                        fontFamily: 'Poppins-Medium',
                                        color: '#0f172a',
                                        marginBottom: 8
                                    }}>
                                        {field.label}
                                    </Text>

                                    <TextInput
                                        value={field.value}
                                        onChangeText={field.setter}
                                        placeholder={`Enter ${field.label}${field.label === 'Languages' || field.label === 'Speciality' ? ' (comma separated)' : ''}`}
                                        placeholderTextColor="#999"
                                        style={{
                                            borderWidth: 1,
                                            borderColor: '#ccc',
                                            borderRadius: 8,
                                            paddingHorizontal: 10,
                                            paddingVertical: 8,
                                            fontFamily: 'Poppins-Medium',
                                            color: '#000'
                                        }}
                                    />
                                </View>
                            ))}

                            {/* Add Button */}
                            <TouchableOpacity
                                onPress={handleSubmit}
                                disabled={loading}
                                style={{
                                    backgroundColor: loading ? '#7dd3fc' : '#0ea5e9',
                                    paddingVertical: 14,
                                    borderRadius: 10,
                                    alignItems: 'center',
                                    marginTop: 10,
                                }}
                            >
                                <Text style={{
                                    fontSize: responsiveFontSize(2),
                                    fontFamily: 'Poppins-SemiBold',
                                    color: '#fff',
                                    letterSpacing: 1
                                }}>
                                    {loading ? 'Adding...' : 'Add Details'}
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>

                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider >
    );
}

export default AddDetails;