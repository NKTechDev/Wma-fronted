import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { Card, Title, Paragraph, useTheme } from 'react-native-paper';
import axios from 'axios';

const VoiceStatsScreen = () => {
  const [stats, setStats] = useState({});
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const fetchStats = async () => {
    try {
      const response = await axios.get('http://192.168.4.214:3000/api/statistics');
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchStats();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }>
      {Object.entries(stats).map(([sender, data]) => (
        <Card key={sender} style={styles.card}>
          <Card.Content>
            <Title>{sender}</Title>
            <Paragraph>Phone: {data.phoneNumber}</Paragraph>
            <Paragraph>Total Messages: {data.totalMessages}</Paragraph>
            <Paragraph>
              Total Duration: {formatDuration(data.totalDuration)}
            </Paragraph>
          </Card.Content>
        </Card>
      ))}
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

export default VoiceStatsScreen;
