// src/screens/JoinMeetScreen.js
import React, { useState } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { goBack, navigate } from '../utils/NavigationUtils'; // Correct path
import { useLiveMeetStore } from '../services/meetStore'; // Correct path
import { useUserStore } from '../services/userStore'; // Correct path
import { checkSession, createSession } from '../services/api/session'; // Correct path
import { removeHyphens } from '../utils/Helpers'; // Correct path
import useSocket from '../hooks/useSockethook'; // Use the custom socket hook

const JoinMeetScreen = () => {
  const [code, setCode] = useState(""); // Meeting code state
  const { emit,on,off } = useSocket(); // Use the useSocket hook

  const { addSessionId, removeSessionId } = useLiveMeetStore();
  const { user, addSession, removeSession } = useUserStore();

  const handleJoin = () => {
    console.log('Joining meet with code:', code);
    joinViaSessionId(); // Trigger joining the meet
  };

  const createNewMeet = async () => {
    const sessionId = await createSession();
    if (sessionId) {
      addSession(sessionId);
      addSessionId(sessionId);
      emit('prepare-session', {
        userId: user?.id,
        sessionId: sessionId,
      });
      navigate('PrepareMeetScreen');
    }
  };

  const joinViaSessionId = async () => {
    const isAvailable = await checkSession(code);
    if (isAvailable) {
      emit('prepare-session', {
        userId: user?.id,
        sessionId: removeHyphens(code),
      });
      addSession(code);
      addSessionId(code);
      navigate('PrepareMeetScreen');
    } else {
      removeSession(code);
      removeSessionId(code);
      setCode(''); // Clear the input
      Alert.alert('Invalid meeting code');
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => goBack()} style={styles.iconButton}>
          <FontAwesome name="arrow-left" size={20} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Join Meet</Text>
        <TouchableOpacity onPress={() => console.log('Ellipsis pressed')} style={styles.iconButton}>
          <FontAwesome name="ellipsis-v" size={20} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.createButton} onPress={createNewMeet}>
        <Text style={styles.createButtonText}>Create New Meet</Text>
      </TouchableOpacity>

      <View style={styles.orContainer}>
        <Text style={styles.orText}>OR</Text>
        <Text style={styles.orSubText}>Join by meeting code provided by the organizer</Text>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter meeting code"
        value={code}
        onChangeText={setCode}
        keyboardType="default"
        returnKeyType="join"
        onSubmitEditing={handleJoin}
      />

      <View style={styles.noteContainer}>
        <Text style={styles.noteText}>Make sure you have the meeting code provided by the organizer.</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    paddingHorizontal: 20,
    justifyContent: 'flex-start',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    padding: 10,
  },
  createButton: {
    backgroundColor: '#007bff',
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  orContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  orText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orSubText: {
    fontSize: 14,
    color: '#777',
    marginTop: 5,
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 50,
  },
});

export default JoinMeetScreen;
