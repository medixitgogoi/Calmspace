import { View, Text, StatusBar } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const UpdateProfile = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#ecf9f9' }}>
                <StatusBar barStyle="dark-content" backgroundColor="#ecf9f9" />

                <Text>UpdateProfile</Text>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

export default UpdateProfile;