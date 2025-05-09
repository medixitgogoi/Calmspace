import { useEffect, useState } from 'react';
import { View, Text, TextInput, StatusBar, ActivityIndicator, ScrollView, TouchableOpacity, Platform, KeyboardAvoidingView } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { getCounselorByID } from '../../utils/getCounselorByID';
import { useSelector } from 'react-redux';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';

const UpdateProfile = ({ navigation }) => {

    const userDetails = useSelector((state) => state.user);
    const authToken = userDetails?.authToken;

    const [loading, setLoading] = useState(true);

    // States for each field
    const [info, setInfo] = useState('');
    const [expertise, setExpertise] = useState('');
    const [languages, setLanguages] = useState([]);
    const [experience, setExperience] = useState('');
    const [degree, setDegree] = useState('');
    const [therapy, setTherapy] = useState('');
    const [speciality, setSpeciality] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCounselorByID(authToken);

                setInfo(data?.info || '');
                setExpertise(data?.expertise || '');
                setLanguages(data?.languages || []);
                setExperience(data?.experience || '');
                setDegree(data?.degree || '');
                setTherapy(data?.therapy || '');
                setSpeciality(data?.speciality || []);

            } catch (error) {
                console.log('Error fetching counselor details: ', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <SafeAreaProvider>
                <SafeAreaView style={styles.centeredContainer}>
                    <ActivityIndicator size={'large'} color={'#0ea5e9'} />
                </SafeAreaView>
            </SafeAreaProvider>
        );
    }

    const CustomInput = ({ label, value, onChangeText }) => (
        <View style={{ marginBottom: 15 }}>
            <Text style={{ marginBottom: 5, color: '#333', fontFamily: 'Poppins-Medium', fontSize: responsiveFontSize(2) }}>{label}</Text>

            <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChangeText}
                multiline
            />
        </View>
    );

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
            const response = await axios.post('/counselor/edit-info', payload, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: authToken,
                }
            });

            console.log('update details response: ', response);

            // if (response?.data?.status_code === 200) {
            //     Toast.show({
            //         type: 'success',
            //         text1: 'Details Added Successfully',
            //         text2: response?.data?.message,
            //         position: 'top',
            //         topOffset: 40,
            //     });

            //     navigation.goBack();

            // } else {
            //     Toast.show({
            //         type: 'error',
            //         text1: 'Failed to add details',
            //         text2: response?.data?.message,
            //         position: 'top',
            //         topOffset: 40,
            //     });
            // }
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
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#fff' }}>
                <StatusBar barStyle="dark-content" backgroundColor="#ecf9f9" />

                {/* Header */}
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'flex-start' }}>
                        <Ionicons name="arrow-back" size={25} color={'#333'} />
                    </TouchableOpacity>

                    <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>
                        Update Profile
                    </Text>

                    <View style={{ width: 35, height: 35 }} />
                </View>

                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ marginTop: 10 }}
                    // keyboardShouldPersistTaps="handled"
                >
                    <CustomInput label="Info" value={info} onChangeText={setInfo} />
                    <CustomInput label="Expertise" value={expertise} onChangeText={setExpertise} />
                    <CustomInput label="Languages (comma separated)" value={languages.join(', ')} onChangeText={(text) => setLanguages(text.split(',').map(item => item.trim()))} />
                    <CustomInput label="Experience" value={experience} onChangeText={setExperience} />
                    <CustomInput label="Degree" value={degree} onChangeText={setDegree} />
                    <CustomInput label="Therapy" value={therapy} onChangeText={setTherapy} />
                    <CustomInput label="Speciality (comma separated)" value={speciality.join(', ')} onChangeText={(text) => setSpeciality(text.split(',').map(item => item.trim()))} />

                    <TouchableOpacity style={styles.updateButton} onPress={() => console.log('Update logic here')}>
                        <Text style={{ color: '#fff', fontSize: responsiveFontSize(2.1), fontFamily: 'Poppins-SemiBold' }}>Update</Text>
                    </TouchableOpacity>

                </ScrollView>

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

const styles = {
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 12,
        padding: 10,
        backgroundColor: '#fff',
        textAlignVertical: 'top',
        fontFamily: 'Poppins-Regular',
        fontSize: responsiveFontSize(1.8)
    },
    updateButton: {
        marginTop: 20,
        backgroundColor: '#0ea5e9',
        padding: 13,
        borderRadius: 14,
        alignItems: 'center',
    },
};

export default UpdateProfile;