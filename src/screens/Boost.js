import { useEffect, useState } from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@react-navigation/elements';
import { responsiveFontSize } from 'react-native-responsive-dimensions';

import { connectSocket } from '../redux/socketSlice';

const Boost = () => {

  const dispatch = useDispatch();

  const userDetails = useSelector(state => state.user);

  const authToken = userDetails?.authToken;

  const [counselors, setCounselors] = useState(null);

  const [loading, setLoading] = useState(true);

  // call connect socket
  useEffect(() => {
    dispatch(connectSocket({ userId: userDetails?._id }));
  }, []);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        {/* StatusBar */}
        <StatusBar
          animated={true}
          barStyle={'dark-content'}
          hidden={false}
        />

        {/* Header */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 5, justifyContent: 'space-between', marginBottom: 10 }}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{ width: 35, height: 35, justifyContent: 'center', alignItems: 'center' }}>
            <Ionicons name="arrow-back" size={25} color={'#333'} />
          </TouchableOpacity>

          <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>Quick Boost</Text>

          <View style={{ width: 35, height: 35 }}></View>
        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Boost;