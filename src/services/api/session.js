import axios from 'axios';
import { BASE_URL } from "../config";

// createSession.js
export const createSession = async () => {
  try {
    const response = await axios.post(`http://192.168.4.214:3000/create-session`, {}, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    const data = response.data;
    console.log('Session Created with ID:', data.sessionId);
    return data.sessionId;
  } catch (error) {
    console.error('Error creating session:', error);
    return null;
  }
};

// checkSessionAlive.js
export const checkSessionAlive = async (sessionId) => {

  console.log("session id in api call ,sessionId:", sessionId);
  try {
    const response = await axios.get(`http://192.168.4.214:3000/is-alive`, {
      params: { sessionId },
    });

    const data = response.data;
    if (data.isAlive) {
      console.log('Session is Alive');
      return true;
    } else {
      console.log('Session is not Alive');
      return false;
    }
  } catch (error) {
    console.error('Error checking session:', error);
    return false;
  }
};
