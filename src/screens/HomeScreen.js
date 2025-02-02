import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, FlatList, Image } from 'react-native';
import { homeStyles } from '../styles/homeStyles'; // Assuming you have global home styles
import HomeHeader from '../components/home/HomeHeader'; // Importing HomeHeader for use at the top
import { useNavigation } from '@react-navigation/native'; // React Navigation hook
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // FontAwesome for the video camera icon
import { useUserStore } from '../services/userStore'; // Accessing user from Zustand store
import { RFValue } from 'react-native-responsive-fontsize';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { addHyphens, removeHyphens } from '../utils/Helpers';
import { checkSessionAlive } from '../services/api/session'; // Updated checkSessionAlive function
import { navigate } from '../utils/NavigationUtils';
import { useLiveMeetStore } from '../services/meetStore';
import useSocket from '../hooks/useSockethook'; // Import useSocket to get emit

const HomeScreen = () => {
  const navigation = useNavigation(); // React Navigation hook for navigation
  const { user, sessions, addSession, removeSession } = useUserStore(); // Accessing user from Zustand store
  const { addSessionId, removeSessionId } = useLiveMeetStore(); // Accessing session management
  const { emit } = useSocket(); // Get the emit function from the socket service

  // Handle Join Meet button press
  const handleJoinMeetPress = () => {
    if (user?.name) {
      console.log('Navigating to JoinMeetScreen');
      navigation.navigate('JoinMeetScreen');
    } else {
      console.log('No user name found');
      Alert.alert('Please enter your name to join the meeting.');
    }
  };

  const joinViaSessionId = async (id) => {
    console.log('Session ID:', id); // Check the ID being passed to the function

    const storedName = user?.name;
    if (!storedName) {
      console.log('No user name found when trying to join session');
      Alert.alert('Please enter your name to join');
      return;
    }

    console.log('Checking session availability for session ID:', id);
    const isAvailable = await checkSessionAlive(id); // Check if the session is alive
    console.log('Session Available:', isAvailable); // Debugging line to verify checkSession

    if (isAvailable) {
      console.log('Session is available, emitting "prepare-session" event');
      emit('prepare-session', {
        userId: user?.id,
        sessionId: removeHyphens(id), // Assuming removeHyphens function is needed here
      });

      console.log('Adding session to the store');
      addSession(id);
      addSessionId(id);

      console.log('Navigating to PrepareMeetScreen');
      navigate('PrepareMeetScreen');
    } else {
      console.log('Session is not available, removing session');
      removeSession(id);
      removeSessionId(id);
      Alert.alert('There is no meet screen available');
    }
  };

  const renderSessions = ({ item }) => {
    return (
      <View style={homeStyles.sessionContainer}>
        <View style={homeStyles.sessionTextContainer}>
          <Text style={homeStyles.sessionTitle}>{addHyphens(item)}</Text>
        </View>
        <TouchableOpacity style={homeStyles.joinButton} onPress={() => joinViaSessionId(item)}>
          <Text style={homeStyles.joinButtonText}>Join</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={homeStyles.container}>
      <HomeHeader />
      <FlatList
        data={sessions}
        renderItem={renderSessions}
        keyExtractor={(item, index) => item.toString() || index.toString()}
        contentContainerStyle={{ padding: 20 }}
        ListEmptyComponent={
          <>
            <Image source={require('../assets/images/bg.png')} style={homeStyles.img} />
            <Text style={homeStyles.title}>Video Calls and meetings for everyone</Text>
            <Text style={homeStyles.subTitle}>Connect and collaborate</Text>
          </>
        }
      />
      <TouchableOpacity style={styles.floatingButton} onPress={handleJoinMeetPress}>
        <FontAwesome name="video-camera" size={20} color="#fff" style={styles.icon} />
        <Text style={styles.buttonText}>Join Meet</Text>
      </TouchableOpacity>
    </View>
  );
};

// Floating button styles
const styles = StyleSheet.create({
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  icon: {
    marginRight: 8,
  },
});

export default HomeScreen;
