import { View, Text } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { primary } from '../utils/colors';

const ProgressBar = ({ score }) => {

    let level = "";
    let colors = [];
    let suggestion = "";
    let iconName = "";

    if (score >= 75) {
        level = "💚 Calm & Collected";
        colors = ["#9dd49f", "#2e8b57"];
        iconName = "emoticon-happy-outline";
    } else if (score >= 50) {
        level = "💙 Managing but Need a Boost";
        colors = ["#7bc0f8", "#0057b7"];
        iconName = "hand-heart-outline";
    } else if (score >= 25) {
        level = "🧡 Feeling Overwhelmed";
        colors = ["#ffbe5e", "#ff6a00"];
        iconName = "emoticon-neutral-outline";
    } else {
        level = "❤️ In the Storm";
        colors = ["#f6695f", "#b22222"];
        iconName = "emoticon-sad-outline";
    }

    suggestion = (
        <>
            <MaterialCommunityIcons name={iconName} size={responsiveFontSize(2.1)} color={colors[1]} />{' '}

            {score >= 75 && (
                <>You're in a great zone! Keep it up, and if you’d like, explore the <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>Quick Boost</Text> feature for an extra lift.</>
            )}

            {score >= 50 && score < 75 && (
                <>You're doing well, but a little extra support might help! Try the <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>Quick Boost</Text> feature or talk to a <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>therapist</Text>.</>
            )}

            {score >= 25 && score < 50 && (
                <>Feeling a bit overwhelmed? It’s okay. The <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>Quick Boost</Text> feature can help, or consider reaching out to a <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>therapist</Text>.</>
            )}

            {score < 25 && (
                <>You're going through a tough time. Please take care—try the <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>Quick Boost</Text> feature and talk to a <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>therapist</Text> for guidance.</>
            )}
        </>
    );

    return (
        <SafeAreaProvider>
            <SafeAreaView style={{ paddingHorizontal: 20, alignItems: 'center', height: 170, paddingVertical: 0 }}>

                {/* Title with Gradient Background */}
                <LinearGradient
                    colors={['#fff', '#8ddcdd', '#fff']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 8,
                        paddingHorizontal: 15,
                        borderRadius: 10,
                        marginBottom: 15,
                        width: '100%',
                    }}
                >
                    <MaterialCommunityIcons name="progress-check" size={responsiveFontSize(2.5)} color={primary} style={{ marginRight: 5 }} />
                    <Text style={{
                        fontSize: responsiveFontSize(1.7),
                        fontFamily: 'Poppins-SemiBold',
                        color: '#333',
                        textAlign: 'center',
                    }}>
                        Your Personalized Progress Bar
                    </Text>
                </LinearGradient>

                {/* Progress Bar Container */}
                <View style={{
                    width: '100%',
                    height: 30,
                    backgroundColor: '#E0E0E0',
                    borderRadius: 15,
                    overflow: 'hidden',
                    justifyContent: 'center'
                }}>
                    {/* Gradient Progress */}
                    <LinearGradient
                        colors={colors}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                            width: `${score}%`,
                            height: '100%',
                            borderRadius: 15,
                            position: 'absolute',
                        }}
                    />

                    {/* Percentage Text */}
                    <Text style={{
                        fontSize: responsiveFontSize(1.8),
                        fontFamily: 'Poppins-Bold',
                        color: score < 50 ? '#333' : '#fff',
                        textAlign: 'center',
                        width: '100%',
                        position: 'absolute',
                    }}>
                        {score}%
                    </Text>
                </View>

                {/* Level Description */}
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2, marginTop: 10, justifyContent: 'center' }}>
                    <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', color: '#888' }}>You are in the '</Text>
                    <Text style={{ fontSize: responsiveFontSize(1.9), color: colors[1], fontFamily: 'Poppins-Bold' }}>{level}</Text>
                    <Text style={{ fontSize: responsiveFontSize(1.9), fontFamily: 'Poppins-Medium', color: '#888' }}>' zone</Text>
                </View>

                {/* Suggestion with Embedded Icon */}
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 5, paddingHorizontal: 10, width: '100%', justifyContent: 'center' }}>
                    {score >= 75 ? (
                        <Text style={{
                            fontSize: responsiveFontSize(1.6),
                            fontFamily: 'Poppins-Light',
                            color: '#555',
                            textAlign: 'center',
                            flexShrink: 1
                        }}>
                            You're in a great zone! Keep it up, and if you’d like, explore the <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>Quick Boost</Text> feature for an extra lift.
                        </Text>
                    ) : score >= 50 && score < 75 ? (
                        <Text style={{
                            fontSize: responsiveFontSize(1.6),
                            fontFamily: 'Poppins-Light',
                            color: '#555',
                            textAlign: 'center',
                            flexShrink: 1
                        }}>
                            You're doing well, but a little extra support might help! Try the <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>Quick Boost</Text> feature or talk to a <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>therapist</Text>.
                        </Text>
                    ) : score >= 25 && score < 50 ? (
                        <Text style={{
                            fontSize: responsiveFontSize(1.6),
                            fontFamily: 'Poppins-Light',
                            color: '#555',
                            textAlign: 'center',
                            flexShrink: 1
                        }}>
                            Feeling a bit overwhelmed? It’s okay. The <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>Quick Boost</Text> feature can help, or consider reaching out to a <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>therapist</Text>.
                        </Text>
                    ) : score < 25 ? (
                        <Text style={{
                            fontSize: responsiveFontSize(1.6),
                            fontFamily: 'Poppins-Light',
                            color: '#555',
                            textAlign: 'center',
                            flexShrink: 1
                        }}>
                            You're going through a tough time. Please take care—try the <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>Quick Boost</Text> feature and talk to a <Text style={{ fontFamily: 'Poppins-ExtraBold' }}>therapist</Text> for guidance.
                        </Text>
                    ) : ''}

                </View>

            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default ProgressBar;