import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from '@react-navigation/drawer';
import { Switch, Text, useTheme } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import axios from 'axios';

const APP_VERSION = '1.0.0';

const CustomDrawerContent = (props) => {
  const { isDarkTheme, toggleTheme } = props;
  const theme = useTheme();

  const clearData = async () => {
    try {
      await axios.post('http://localhost:3000/api/clear-data');
      // You might want to add a refresh mechanism here
    } catch (error) {
      console.error('Error clearing data:', error);
    }
  };

  return (
    <DrawerContentScrollView {...props}>
      <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
        <View style={styles.header}>
          <Icon name="whatsapp" size={50} color={theme.colors.primary} />
          <Text style={[styles.title, { color: theme.colors.text }]}>
            WhatsApp Voice Analysis
          </Text>
        </View>

        <DrawerItemList {...props} />

        <View style={styles.section}>
          <View style={styles.themeContainer}>
            <Text style={{ color: theme.colors.text }}>Dark Theme</Text>
            <Switch value={isDarkTheme} onValueChange={toggleTheme} />
          </View>

          <DrawerItem
            label="Clear Data"
            icon={({ color, size }) => (
              <Icon name="delete" color={color} size={size} />
            )}
            onPress={clearData}
          />

          <View style={styles.versionContainer}>
            <Text style={[styles.version, { color: theme.colors.text }]}>
              Version: {APP_VERSION}
            </Text>
          </View>
        </View>
      </View>
    </DrawerContentScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  section: {
    marginTop: 20,
  },
  themeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  versionContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    marginTop: 20,
  },
  version: {
    fontSize: 12,
  },
});

export default CustomDrawerContent;
