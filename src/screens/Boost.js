import { useCallback, useEffect, useState } from 'react';
import { StatusBar, TouchableOpacity, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Text } from '@react-navigation/elements';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useFocusEffect } from '@react-navigation/native';
import { fetchCounselors } from '../utils/fetchCounselors';

const Boost = () => {

  const userDetails = useSelector(state => state.user);

  const authToken = userDetails?.[0]?.authToken;

  const [counselors, setCounselors] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch counselors
  useFocusEffect(
    useCallback(() => {
      const fetchData = async () => {
        try {
          const data = await fetchCounselors(authToken); // Fetch all counselors

          setCounselors(data?.slice(0, 10));

        } catch (error) {
          console.log('Error fetching counselors: ', error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

      // If you want cleanup logic, you can return a function here.
      return () => { };

    }, [authToken]) // Include dependencies
  );

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

          <Text style={{ fontSize: responsiveFontSize(2.3), fontFamily: 'Poppins-SemiBold', color: '#000', paddingTop: 2 }}>Quock Boost</Text>

          <View style={{ width: 35, height: 35 }}></View>
        </View>

        <View>

        </View>

      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default Boost;