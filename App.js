import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ChatScreen from './screens/ChatScreen';

// Create a Stack Navigator
const Stack = createStackNavigator();

function LoginScreen({ navigation }) {
  const [qrCode, setQrCode] = useState(null);  // State to store the QR code
  const [isLoggedIn, setIsLoggedIn] = useState(false);  // State to track login
  const [loading, setLoading] = useState(true);  // State for loading indicator
  const [error, setError] = useState(null);  // State for error messages
  const [isWhatsAppReady, setIsWhatsAppReady] = useState(false);  // State for WhatsApp status
  const [whatsappStatus, setWhatsappStatus] = useState('Checking...'); // WhatsApp status message

  const backendUrl = 'http://192.168.4.214:3000';  // Replace with your actual backend URL

  // Fetch QR code from backend
  useEffect(() => {
    axios.get(`${backendUrl}/qrcode`)
      .then(response => {
        const qr = response.data.qr;
        console.log('QR Code Response:', response.data);  // Log the full response
        console.log('QR Code received:', qr);

        if (qr && typeof qr === 'string') {
          setQrCode(qr);  // Set the QR code data to state
        } else {
          console.error('Received invalid QR data:', qr);
          Alert.alert('Error', 'Invalid QR data received!');
        }
        setLoading(false);  // Set loading to false after fetching QR code
      })
      .catch(error => {
        console.error('Error fetching QR code:', error);
        setLoading(false);  // Set loading to false in case of error
        setError('Failed to fetch QR code!');
        Alert.alert('Error', 'Failed to fetch QR code!');
      });

    // Polling WhatsApp status every 3 seconds to check if it's ready
    const statusInterval = setInterval(() => {
      axios.get(`${backendUrl}/whatsapp-status`)
        .then(response => {
          console.log('WhatsApp Status Response:', response.data);  // Log the full status response
          if (response.data.status === 'ready') {
            console.log('WhatsApp is ready!');
            setIsWhatsAppReady(true);  // WhatsApp is ready
            setWhatsappStatus('WhatsApp is Ready!');
            setIsLoggedIn(true);  // Mark as logged in
            clearInterval(statusInterval);  // Clear the interval once it's ready
            navigation.replace('Home');  // Navigate to Home screen after WhatsApp is ready
          } else {
            setWhatsappStatus('WhatsApp is not ready. Please wait...');
          }
        })
        .catch(error => {
          console.error('Error fetching WhatsApp status:', error);
          Alert.alert('Error', 'Failed to check WhatsApp status!');
        });
    }, 10000);  // Check status every 3 seconds

    return () => clearInterval(statusInterval);  // Cleanup the interval on component unmount
  }, [navigation]);  // Adding navigation as a dependency to ensure it's up-to-date

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />  // Show loading indicator
      ) : (
        <View style={{ alignItems: 'center' }}>
          {!isLoggedIn ? (
            <>
              <Text>Scan this QR code to log in to WhatsApp</Text>
              {qrCode ? (
                <QRCode value={qrCode} size={200} />  // QR code for WhatsApp login
              ) : (
                <Text>QR Code not available yet</Text>  // Show a message if QR code is not available
              )}
            </>
          ) : (
            <>
              <Text>Logged in successfully! Redirecting to home...</Text>
            </>
          )}
          {error && <Text style={{ color: 'red' }}>{error}</Text>}

          {/* Display WhatsApp status */}
          <Text>{whatsappStatus}</Text>
        </View>
      )}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Chat" component={ChatScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
