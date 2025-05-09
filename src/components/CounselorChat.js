import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { responsiveFontSize } from 'react-native-responsive-dimensions';
import { useSelector } from 'react-redux';
import { getOnlineUsers } from '../utils/getOnlineUsers';
import { useCallback, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';

const CounselorChat = ({ navigation }) => {

  const userDetails = useSelector(state => state.user);
  const authToken = userDetails?.authToken;

  const [users, setUsers] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // fetchUsers
  const fetchUsers = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    try {
      const data = await getOnlineUsers(authToken);

      setUsers(data);
    } catch (error) {
      console.log('Error fetching users: ', error);
    } finally {
      if (isRefresh) {
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  // onRefresh function
  const onRefresh = useCallback(() => {
    fetchUsers(true);
  }, [authToken]);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [authToken])
  );

  // chat card
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate('QuickBoostChat', { id: item?._id })} style={{ flexDirection: 'row', alignItems: 'center', padding: 11, backgroundColor: '#e0f7fb', marginBottom: 12, borderRadius: 15, elevation: 2 }}>
      <Image source={{ uri: item?.pic }} style={{ width: 37, height: 37, borderRadius: 25, marginRight: 12 }} />
      <Text style={{ fontSize: responsiveFontSize(1.9), color: '#000', fontFamily: 'Poppins-Medium' }}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingVertical: 16 }}>
      <Text style={{ fontSize: responsiveFontSize(2.5), fontFamily: 'Poppins-SemiBold', color: '#0f172a', marginBottom: 5, textAlign: 'center' }}>
        Chats
      </Text>

      {loading ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : users && users.length > 0 ? (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 1, paddingTop: 10 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#0ea5e9']} tintColor="#0ea5e9" />}
        />
      ) : (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <Text style={{ fontSize: responsiveFontSize(1.9), color: '#999', fontFamily: 'Poppins-Regular', textAlign: 'center' }}>
            No chats available yet.
          </Text>
        </View>
      )}
    </View>
  );
};

export default CounselorChat;