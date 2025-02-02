import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Alert, Button } from 'react-native';
import axios from 'axios';
import RNFS from 'react-native-fs'; // File system for saving the PDF file

function HomeScreen({ navigation }) {
  const [contacts, setContacts] = useState([]); // Store contacts
  const [loading, setLoading] = useState(true); // Store loading state
  const backendUrl = 'http://192.168.4.214:3000'; // Backend URL for fetching data

  // Fetch contacts after logging in
  const fetchContacts = () => {
    axios.get(`${backendUrl}/user_durations`) // Fetch user durations from the backend
      .then(response => {
        console.log('User Durations fetched:', response.data);
        setContacts(response.data); // Set contacts state with the response data
        setLoading(false); // Set loading to false once data is fetched
      })
      .catch(error => {
        console.error('Error fetching contacts:', error);
        setLoading(false);
        Alert.alert('Error', 'Failed to fetch contacts!');
      });
  };

  useEffect(() => {
    fetchContacts(); // Fetch contacts on Home screen load
  }, []);

  // Renaming variables for clearer names
  const renderContactItem = ({ item }) => {
    const { name: contactNumber, notify_name: displayName, total_duration: duration, last_timestamp: timestamp } = item;

    const contactName = displayName || contactNumber; // Use display name if available, otherwise use number

    return (
      <TouchableOpacity
        style={styles.contactContainer}
        onPress={() => navigation.navigate('Chat', { contact: item })}  // Navigate to chat screen
      >
        <View style={styles.contactInfo}>
          <Text style={styles.contactName}>{contactName}</Text>
          <Text style={styles.contactDuration}>Duration: {duration} seconds</Text>
          <Text style={styles.contactTimestamp}>{new Date(timestamp * 1000).toLocaleString()}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Custom PDF Export Functionality without any third-party libraries
  const createPDF = async (data) => {
    try {
      const pdfPath = `${RNFS.DocumentDirectoryPath}/user_durations.txt`;

      let pdfContent = 'User Durations Report\n\n';
      pdfContent += 'Name, Total Duration (seconds), Last Timestamp\n';

      data.forEach((item) => {
        const { name, total_duration, last_timestamp } = item;
        const date = new Date(last_timestamp * 1000).toLocaleString();
        pdfContent += `${name}, ${total_duration}, ${date}\n`;
      });

      // Write to a file (this will create a .txt file as a basic form of PDF-like export)
      await RNFS.writeFile(pdfPath, pdfContent, 'utf8');

      Alert.alert('PDF Created', 'Your PDF has been saved successfully.');
      console.log('PDF Created at: ', pdfPath);
    } catch (error) {
      console.error('Error generating PDF:', error);
      Alert.alert('Error', 'Failed to create PDF!');
    }
  };

  // Graph Data for Custom Bar Chart (using Views for bars)
  const renderChart = () => {
    const maxDuration = Math.max(...contacts.map(item => item.total_duration)); // Max value for scaling
    return contacts.map((item, index) => {
      const height = (item.total_duration / maxDuration) * 200; // Scale the height of the bar

      return (
        <View key={index} style={[styles.barContainer, { marginLeft: 10 }]}>
          <Text style={styles.barLabel}>{item.notify_name || item.name}</Text>
          <View
            style={[
              styles.bar,
              { height: height, backgroundColor: '#3498db', width: 30 },
            ]}
          />
          <Text style={styles.barValue}>{item.total_duration}</Text>
        </View>
      );
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>User Durations</Text>

      {loading ? (
        <Text>Loading contacts...</Text>
      ) : (
        <>
          <FlatList
            data={contacts}
            renderItem={renderContactItem}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={styles.contactList}
          />

          {/* Display Custom Bar Chart */}
          <View style={styles.chartContainer}>
            {renderChart()}
          </View>

          {/* Button to Create and Export PDF */}
          <Button title="Download PDF" onPress={() => createPDF(contacts)} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5ddd5',
    padding: 10,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  contactList: {
    paddingBottom: 10,
  },
  contactContainer: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  contactDuration: {
    fontSize: 14,
    color: '#888',
  },
  contactTimestamp: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  chartContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 20,
    marginBottom: 20,
  },
  barContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  bar: {
    width: 30,
    marginBottom: 5,
    backgroundColor: '#3498db',
  },
  barLabel: {
    fontSize: 12,
    color: '#333',
  },
  barValue: {
    fontSize: 12,
    color: '#333',
  },
});

export default HomeScreen;
