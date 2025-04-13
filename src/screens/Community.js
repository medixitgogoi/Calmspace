import { View, Text, StatusBar } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { background } from '../utils/colors';
import LottieView from 'lottie-react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

const Community = () => {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: background, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10 }}>
        {/* Status Bar */}
        <StatusBar animated={true} barStyle={'dark-content'} hidden={false} />

        {/* Coming Soon Animation */}
        <LottieView
          source={require('../assets/animations/coming.json')}
          autoPlay
          loop
          style={{ width: 250, height: 250 }}
        />

        <Text style={{ fontSize: responsiveFontSize(2.2), fontFamily: 'Poppins-Bold', marginTop: 20, color: '#333', textAlign: 'center' }}>
          Community Feature Coming Soon. Stay tuned!
        </Text>

        <Text style={{ fontSize: responsiveFontSize(1.6), fontFamily: 'Poppins-Medium', marginTop: 10, color: '#777', textAlign: 'center' }}>
          Connect with others, share your thoughts, and be part of the conversation.
        </Text>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Community;