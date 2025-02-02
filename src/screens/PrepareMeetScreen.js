import React, { useState, useEffect, useRef } from 'react';
import { View, Button, StyleSheet, Text, FlatList } from 'react-native';
import { RTCView, mediaDevices } from 'react-native-webrtc';
import { useUserStore } from '../services/userStore';
import { useLiveMeetStore } from '../services/meetStore';
import useSocket from '../hooks/useSockethook';
import { navigate, replace } from '../utils/NavigationUtils';

const PrepareMeetScreen = () => {
  const [stream, setStream] = useState(null); // The media stream
  const [micOn, setMicOn] = useState(true); // Mic state
  const [videoOn, setVideoOn] = useState(true); // Camera state
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const [participants, setParticipants] = useState([]); // Participants list
  console.log(participants);

  const localStreamRef = useRef(); // Reference to hold the local stream
  const { user } = useUserStore();
  const { emit, on, off } = useSocket();
  const { addParticipant, sessionId, addSessionId } = useLiveMeetStore();
  console.log(sessionId);
  console.log(user?.name);

  // Function to start the media stream (camera & microphone)
  const startStream = async () => {
    try {
      const constraints = {
        audio: micOn,
        video: videoOn,
      };
      const newStream = await mediaDevices.getUserMedia(constraints); // Get the media stream
      setStream(newStream);
      localStreamRef.current = newStream;
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to get media: ', error);
      setIsLoading(false);
    }
  };

  // Function to toggle microphone on/off
  const toggleMic = () => {
    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getAudioTracks(); // Get the audio tracks
      tracks.forEach((track) => {
        track.enabled = !track.enabled; // Toggle the enabled state of the track
      });
      setMicOn(!micOn); // Update the mic state
    }
  };

  // Function to toggle camera on/off
  const toggleCamera = () => {
    if (localStreamRef.current) {
      const tracks = localStreamRef.current.getVideoTracks(); // Get the video tracks
      tracks.forEach((track) => {
        track.enabled = !track.enabled; // Toggle the enabled state of the track
      });
      setVideoOn(!videoOn); // Update the camera state
    }
  };

  // Handle participant updates
  useEffect(() => {
    const handleParticipantUpdate = (updatedParticipants) => {
      setParticipants(updatedParticipants.participants);
    };
    on('session-info', handleParticipantUpdate);

    // Cleanup the event listener
    return () => {
      off('session-info', handleParticipantUpdate);
    };
  }, []);

  // Handle the start of the call (join session)
  const handleStartCall = () => {
    try {
      emit('join-session', {
        name: user?.name,
        photo: user?.photo,
        userId: user?.id,
        sessionId: sessionId,
        micOn: micOn,
        videoOn: videoOn,
      });
      participants.forEach(participant => addParticipant(participant));
      addSessionId(sessionId);

    // Introduce a slight delay (for debugging)
    setTimeout(() => {
      navigate('LiveMeetScreen'); // Try replacing after a short delay
    }, 500); // 500ms delay to ensure everything is ready
    } catch (error) {v 
      console.error('Error starting the call:', error);
    }
  };

  // Start the stream when the component mounts
  useEffect(() => {
    startStream();
  }, []); // Empty dependency array ensures this runs once on mount

  // Render participants list
  const renderParticipantItem = ({ item }) => (
    <View style={styles.participantItem}>
      <Text>{item.name}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {isLoading ? (
        <Text>Loading...</Text>
      ) : (
        <RTCView
          style={styles.rtcView} // Style for the video display
          objectFit="cover" // How the video should fit in the container
          streamURL={stream ? stream.toURL() : ''} // URL of the media stream to display
        />
      )}

      {/* Controls for toggling camera and mic */}
      <View style={styles.controls}>
        <Button title={micOn ? 'Mute Mic' : 'Unmute Mic'} onPress={toggleMic} />
        <Button title={videoOn ? 'Turn Off Camera' : 'Turn On Camera'} onPress={toggleCamera} />
      </View>

      {/* Start call button */}
      <Button title="Start Call" onPress={handleStartCall} />

      {/* Display Participants List */}
      <View style={styles.participantsContainer}>
        <Text style={styles.participantsHeader}>
          {participants.length > 0 ? `Participants (${participants.length})` : 'No participants in the meeting'}
        </Text>
        {participants.length > 0 ? (
          <FlatList
            data={participants}
            renderItem={renderParticipantItem}
            keyExtractor={(item) => item.userId.toString()}
            style={styles.participantsList}
          />
        ) : (
          <Text>No participants in the meeting</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rtcView: {
    width: '100%',
    height: 400, // Set the height of the video
    backgroundColor: 'black', // Background color for the RTC view
  },
  controls: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  participantsContainer: {
    marginTop: 20,
    width: '80%',
    alignItems: 'center',
  },
  participantsHeader: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  participantsList: {
    marginTop: 10,
    width: '100%',
  },
  participantItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default PrepareMeetScreen;
