import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, Alert, ScrollView, RefreshControl } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';

const Stack = createStackNavigator();

function LoginScreen({ navigation }) {
  const [qrCode, setQrCode] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isWhatsAppReady, setIsWhatsAppReady] = useState(false);
  const [whatsappStatus, setWhatsappStatus] = useState('Checking...');
  const [refreshing, setRefreshing] = useState(false);

  const backendUrl = 'http://192.168.4.214:3000';  // Replace with your actual backend URL

  useEffect(() => {
    // Fetch QR code initially
    fetchQRCode();

    // Polling WhatsApp status every 5 seconds to check if it's ready
    const statusInterval = setInterval(() => {
      fetch(`${backendUrl}/whatsapp-status`)
        .then(response => response.json())
        .then(data => {
          if (data.status === 'ready') {
            setIsWhatsAppReady(true);
            setWhatsappStatus('WhatsApp is Ready!');
            setIsLoggedIn(true);
            clearInterval(statusInterval);
            navigation.replace('Home');
          } else {
            setWhatsappStatus('WhatsApp is not ready. Please wait...');
          }
        })
        .catch(error => {
          Alert.alert('Error', 'Failed to check WhatsApp status!');
        });
    }, 5000);

    return () => clearInterval(statusInterval);
  }, [navigation]);

  // Fetch the QR code from the API
  const fetchQRCode = () => {
    setLoading(true);  // Show loading indicator
    fetch(`${backendUrl}/qrcode`)
      .then(response => response.json())
      .then(data => {
        const qr = data.qr;
        if (qr && typeof qr === 'string') {
          setQrCode(qr);  // Set the QR code data
        } else {
          Alert.alert('Error', 'Invalid QR data received!');
        }
        setLoading(false);  // Hide loading indicator
      })
      .catch(error => {
        setLoading(false);  // Hide loading indicator
        setError('Failed to fetch QR code!');
        Alert.alert('Error', 'Failed to fetch QR code!');
      });
  };

  const handleRefresh = () => {
    setRefreshing(true);  // Start refreshing
    fetchQRCode();  // Fetch the QR code again
    setRefreshing(false);  // Stop refreshing
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ScrollView
        contentContainerStyle={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View style={{ alignItems: 'center' }}>
            {!isLoggedIn ? (
              <>
                <Text>Scan this QR code to log in to WhatsApp</Text>
                {qrCode ? (
                  <QRCode value={qrCode} size={200} />
                ) : (
                  <Text>QR Code not available yet</Text>
                )}
              </>
            ) : (
              <>
                <Text>Logged in successfully! Redirecting to home...</Text>
              </>
            )}
            {error && <Text style={{ color: 'red' }}>{error}</Text>}
            <Text>{whatsappStatus}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Home" options={{ headerShown: false }} component={HomeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
