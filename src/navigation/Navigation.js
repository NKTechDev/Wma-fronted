import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import HomeScreen from '../screens/HomeScreen';
import { Provider } from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import JoinMeetScreen from '../screens/JoinMeetScreen';
import LiveMeetScreen from '../screens/LiveMeetScreen';
import PrepareMeetScreen from '../screens/PrepareMeetScreen';
import { navigationRef } from '../utils/NavigationUtils'; // Custom navigation reference
import store from '../../Slice/store';

const Stack = createNativeStackNavigator();

const Navigation = () => {
  return (
    <Provider store={store}>
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator 
          initialRouteName="SplashScreen" 
          screenOptions={{ headerShown: false }} // Hide the default header for all screens
        >
          <Stack.Screen name="SplashScreen" component={SplashScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="JoinMeetScreen" component={JoinMeetScreen} />
          <Stack.Screen name="LiveMeetScreen" component={LiveMeetScreen} />
          <Stack.Screen name="PrepareMeetScreen" component={PrepareMeetScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default Navigation;
