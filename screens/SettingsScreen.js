import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { List, Switch, Button, useTheme } from 'react-native-paper';
import axios from 'axios';

const SettingsScreen = ({ navigation }) => {
  const theme = useTheme();

  const clearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all voice message data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          onPress: async () => {
            try {
              await axios.post('http://localhost:3000/api/clear-data');
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
              console.error('Error clearing data:', error);
            }
          },
          style: 'destructive',
        },
      ],
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <List.Section>
        <List.Subheader>Data Management</List.Subheader>
        <List.Item
          title="Clear All Data"
          description="Delete all stored voice message data"
          left={props => <List.Icon {...props} icon="delete" />}
          onPress={clearAllData}
        />
      </List.Section>

      <List.Section>
        <List.Subheader>About</List.Subheader>
        <List.Item
          title="Version"
          description="1.0.0"
          left={props => <List.Icon {...props} icon="information" />}
        />
        <List.Item
          title="Developer"
          description="Islamic Innovations"
          left={props => <List.Icon {...props} icon="code-tags" />}
        />
      </List.Section>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default SettingsScreen;
