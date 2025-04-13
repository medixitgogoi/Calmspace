import { View, Text, TouchableOpacity } from 'react-native';
import { primary } from '../utils/colors';

const RadioButton = ({ label, selected, onPress }) => {
    return (
        <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
            onPress={onPress}
        >
            <View style={{
                height: 22,
                width: 22,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: selected ? '#1f8dba' : '#a6a6a6',
                alignItems: 'center',
                justifyContent: 'center',
            }}>
                {selected && (
                    <View style={{
                        height: 12,
                        width: 12,
                        borderRadius: 6,
                        backgroundColor: '#1f8dba',
                    }} />
                )}
            </View>

            <Text style={{ marginLeft: 10, color: primary, fontFamily: 'Poppins-SemiBold', fontSize: 15 }}>{label}</Text>
            
        </TouchableOpacity>
    );
};

export default RadioButton;