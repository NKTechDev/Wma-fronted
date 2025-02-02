import React, { useEffect } from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { screenHeight, screenWidth } from '../utils/Constants';
import { resetAndNavigate } from '../utils/NavigationUtils';

const SplashScreen: React.FC = () => {
  // Get the screen width and height using Dimensions API
  useEffect(()=>{
    // Simulate a delay of 2 seconds before showing the Home screen
    setTimeout(() => {
      // Navigate to the Home screen after 2 seconds
      // Replace 'Home' with the actual screen component name
      resetAndNavigate('HomeScreen')
    }, 2000);
  })

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/g.png')}
        style={{
          width: screenWidth * 0.7,  // 70% of the screen width
          height: screenHeight * 0.2, // 70% of the screen height
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',  // Center content vertically
    alignItems: 'center',      // Center content horizontally
    backgroundColor: '#fff',   // Set background color to white (optional)
  },
});

export default SplashScreen;
