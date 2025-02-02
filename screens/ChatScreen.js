import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';

function ChatScreen({ route, navigation }) {
  const { contact } = route.params;  // Get the selected contact from the navigation params
  const [messages, setMessages] = useState([]);
  const [totalVoiceDuration, setTotalVoiceDuration] = useState(0); // New state for voice message duration
  const [newMessage, setNewMessage] = useState('');
  const backendUrl = 'http://192.168.4.214:3000';  // Replace with your backend URL

  // Fetch chat messages for the selected contact by contact name
  useEffect(() => {
    axios.get(`${backendUrl}/messages-by-name/${contact.name}`)
      .then(response => {
        console.log('Messages fetched:', response.data);
        setMessages(response.data.messages);  // Update state with messages
        setTotalVoiceDuration(response.data.totalVoiceDuration);  // Set total voice duration
      })
      .catch(error => {
        console.error('Error fetching messages:', error);
      });
  }, [contact]);

  // Handle sending a new message
  const sendMessage = () => {
    if (newMessage.trim() === '') return;

    // Add new message to the state (for immediate UI update)
    setMessages(prevMessages => [...prevMessages, { body: newMessage, sender: 'Me' }]);

    // Send the new message to the backend
    axios.post(`${backendUrl}/send-message`, {
      contactId: contact.id,
      message: newMessage,
    })
      .then(response => {
        console.log('Message sent:', response.data);
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });

    // Clear the input field
    setNewMessage('');
  };

  // Render a single message item
  const renderMessageItem = ({ item }) => {
    const isUserMessage = item.sender === 'Me';  // Check if the message is sent by the user
    return (
      <View
        style={[
          styles.messageContainer,
          isUserMessage ? styles.userMessage : styles.contactMessage,
        ]}
      >
        <Text style={styles.messageText}>{item.body}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.contactName}>{contact.name}</Text>
      <Text style={styles.voiceDurationText}>
        Total Voice Message Duration: {totalVoiceDuration} seconds
      </Text>
      <FlatList
        data={messages}
        renderItem={renderMessageItem}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={styles.chatContainer}
      />
      <TextInput
        style={styles.input}
        placeholder="Type a message..."
        value={newMessage}
        onChangeText={setNewMessage}
      />
      <Button title="Send" onPress={sendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#e5ddd5',
  },
  contactName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  voiceDurationText: {
    fontSize: 18,
    marginVertical: 10,
    textAlign: 'center',
    color: '#0078d4',
  },
  chatContainer: {
    paddingBottom: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  userMessage: {
    backgroundColor: '#dcf8c6',
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  contactMessage: {
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  messageText: {
    fontSize: 16,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default ChatScreen;
