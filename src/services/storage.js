import { MMKV } from 'react-native-mmkv';

// Initialize MMKV storage with encryption key
export const storage = new MMKV({
  id: 'user_storage',
  encryptionKey: '1234564f4sd5dfdsss', // Ensure the encryption key is long and secure
});

// Define mmkvStorage methods
export const mmkvStorage = {
  // Set item in MMKV storage
  setItem: (key, value) => {
    try {
      const stringValue = JSON.stringify(value); // Ensure value is stored as a string
      storage.set(key, stringValue); // Save the stringified value to storage
      console.log(`Stored data with key: ${key}`, stringValue); // Log the stored data
    } catch (error) {
      console.error('Error storing data in MMKV', error); // Error handling
    }
  },
 
  // Remove item from MMKV storage
  removeItem: (key) => {
    try {
      storage.delete(key); // Delete the item
      console.log(`Removed data with key: ${key}`); // Log the removal
    } catch (error) {
      console.error('Error removing data from MMKV', error); // Error handling
    }
  },

  // Get item from MMKV storage
  getItem: (key) => {
    try {
      const value = storage.getString(key); // Get the string value from MMKV
      if (value) {
        const parsedValue = JSON.parse(value); // Parse it back to the original object
        console.log(`Retrieved data with key: ${key}`, parsedValue); // Log the retrieved data
        return parsedValue; // Return the parsed value
      } else {
        console.log(`No data found for key: ${key}`); // Log if no data was found
        return null; // Return null if not found
      }
    } catch (error) {
      console.error('Error retrieving data from MMKV', error); // Error handling
      return null;
    }
  },
};
