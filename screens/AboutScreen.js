import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Title, Paragraph, useTheme } from 'react-native-paper';

const AboutScreen = () => {
  const theme = useTheme();

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Card style={styles.card}>
        <Card.Content>
          <Title>WhatsApp Voice Message Analyzer</Title>
          <Paragraph>
            Version: 1.0.0{'\n'}
            Package Name: com.islamicins.WMA{'\n'}
            Developer: Islamic Innovations
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>Features</Title>
          <Paragraph>
            • Track WhatsApp voice messages{'\n'}
            • Analyze message duration{'\n'}
            • View user statistics{'\n'}
            • Dark/Light theme support{'\n'}
            • Real-time updates
          </Paragraph>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title>How to Use</Title>
          <Paragraph>
            1. Start the backend server{'\n'}
            2. Scan the QR code with WhatsApp{'\n'}
            3. Start receiving voice messages{'\n'}
            4. View statistics in real-time{'\n'}
            5. Use the drawer menu to access features
          </Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
});

export default AboutScreen;
