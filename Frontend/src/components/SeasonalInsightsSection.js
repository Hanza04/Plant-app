import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { saveSeasonalInsight } from '../api/insightsAPI';

const SeasonalInsightsSection = ({ navigation, user, userProfile, weatherData }) => {
  const [loading, setLoading] = useState(false);
  const [savedInsights, setSavedInsights] = useState({});

  // Generate insights based on weather data
  const generateInsights = () => {
    if (!weatherData) return [];

    const insights = [];
    const temp = weatherData.temperature || 0;
    const humidity = weatherData.humidity || 50;
    const condition = weatherData.condition || 'Unknown';
    const location = userProfile?.location || 'Unknown';

    // Temperature Alert
    if (temp > 35) {
      insights.push({
        id: 'temp_high',
        type: 'temperature_alert',
        icon: '🌡️',
        title: 'High Temperature Alert',
        context: `Temperature is ${temp}°C - Very hot!`,
        recommendation: 'Water plants more frequently in early morning and evening. Use shade cloth if needed.',
        color: '#ff6b6b',
        bgColor: '#ffe0e0',
      });
    } else if (temp < 10) {
      insights.push({
        id: 'temp_low',
        type: 'temperature_alert',
        icon: '❄️',
        title: 'Low Temperature Alert',
        context: `Temperature is ${temp}°C - Too cold!`,
        recommendation: 'Protect plants from frost. Move potted plants indoors. Reduce watering.',
        color: '#4dabf7',
        bgColor: '#e0f2ff',
      });
    } else {
      insights.push({
        id: 'temp_good',
        type: 'temperature_alert',
        icon: '✅',
        title: 'Ideal Temperature',
        context: `Temperature is ${temp}°C - Perfect for growth!`,
        recommendation: 'Great conditions for plant growth. Continue regular care routine.',
        color: '#51cf66',
        bgColor: '#e6ffed',
      });
    }

    // Humidity Alert
    if (humidity > 80) {
      insights.push({
        id: 'humidity_high',
        type: 'humidity_alert',
        icon: '💧',
        title: 'High Humidity Alert',
        context: `Humidity is ${humidity}% - Very humid!`,
        recommendation: 'Improve air circulation. Water less frequently. Watch for fungal diseases.',
        color: '#ff8787',
        bgColor: '#ffe3e3',
      });
    } else if (humidity < 30) {
      insights.push({
        id: 'humidity_low',
        type: 'humidity_alert',
        icon: '🏜️',
        title: 'Low Humidity Alert',
        context: `Humidity is ${humidity}% - Very dry!`,
        recommendation: 'Mist plants regularly. Group plants together. Use pebble trays with water.',
        color: '#ffa94d',
        bgColor: '#ffe8cc',
      });
    } else {
      insights.push({
        id: 'humidity_good',
        type: 'humidity_alert',
        icon: '✅',
        title: 'Good Humidity Level',
        context: `Humidity is ${humidity}% - Optimal!`,
        recommendation: 'Humidity is ideal. Maintain current conditions.',
        color: '#51cf66',
        bgColor: '#e6ffed',
      });
    }

    // Disease Alert based on conditions
    if (temp > 28 && humidity > 70) {
      insights.push({
        id: 'disease_risk',
        type: 'disease_alert',
        icon: '⚠️',
        title: 'Disease Risk Alert',
        context: 'High temperature + high humidity = fungal disease risk',
        recommendation: 'Reduce watering from above. Improve air circulation. Inspect leaves daily.',
        color: '#ff922b',
        bgColor: '#ffe066',
      });
    }

    // Seasonal Tips
    const month = new Date().getMonth();
    if (month === 5 || month === 6 || month === 7) { // June, July, August - Summer
      insights.push({
        id: 'seasonal_tip',
        type: 'seasonal_tip',
        icon: '☀️',
        title: 'Summer Care Tip',
        context: 'Summer season requires extra care',
        recommendation: 'Provide afternoon shade. Water daily. Fertilize bi-weekly. Keep humidity up.',
        color: '#ff922b',
        bgColor: '#fff3e0',
      });
    } else if (month === 11 || month === 0 || month === 1) { // Dec, Jan, Feb - Winter
      insights.push({
        id: 'seasonal_tip',
        type: 'seasonal_tip',
        icon: '❄️',
        title: 'Winter Care Tip',
        context: 'Winter season requires different approach',
        recommendation: 'Reduce watering. Move away from cold drafts. Reduce fertilizing. Prune if needed.',
        color: '#4dabf7',
        bgColor: '#e0f2ff',
      });
    }

    return insights;
  };

  const insights = generateInsights();

  const handleSaveInsight = async (insight) => {
    try {
      setLoading(true);

      const insightData = {
        userName: userProfile?.name || user?.displayName || 'User',
        location: userProfile?.location || 'Unknown',
        temperature: weatherData?.temperature || 0,
        humidity: weatherData?.humidity || 0,
        weatherCondition: weatherData?.condition || 'Unknown',
        insightType: insight.type,
        insightContext: insight.context,
        recommendation: insight.recommendation,
      };

      await saveSeasonalInsight(insightData);

      setSavedInsights((prev) => ({
        ...prev,
        [insight.id]: true,
      }));

      Alert.alert('Success', 'Insight saved to your profile!');
    } catch (error) {
      console.error('Error saving insight:', error);
      Alert.alert('Error', 'Failed to save insight');
    } finally {
      setLoading(false);
    }
  };

  const renderInsightCard = (insight) => (
    <View
      key={insight.id}
      style={[styles.insightCard, { backgroundColor: insight.bgColor }]}
    >
      {/* Header */}
      <View style={styles.insightHeader}>
        <View style={styles.insightTitleContainer}>
          <Text style={styles.insightIcon}>{insight.icon}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.insightTitle, { color: insight.color }]}>
              {insight.title}
            </Text>
            <Text style={styles.insightContext}>{insight.context}</Text>
          </View>
        </View>
      </View>

      {/* Recommendation */}
      <Text style={styles.insightRecommendation}>
        💡 {insight.recommendation}
      </Text>

      {/* Save Button */}
      <TouchableOpacity
        style={[
          styles.saveBtn,
          savedInsights[insight.id] && styles.saveBtnActive,
        ]}
        onPress={() => handleSaveInsight(insight)}
        disabled={loading || savedInsights[insight.id]}
      >
        <Text
          style={[
            styles.saveBtnText,
            savedInsights[insight.id] && styles.saveBtnTextActive,
          ]}
        >
          {savedInsights[insight.id] ? '✓ Saved' : '💾 Save Insight'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>🌤️ Seasonal Insights</Text>
        <TouchableOpacity
          onPress={() => navigation?.navigate?.('Profile')}
          style={styles.viewAllBtn}
        >
          <Text style={styles.viewAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      {/* Weather Info (if available) */}
      {weatherData && (
        <View style={styles.weatherInfoContainer}>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLabel}>Temp</Text>
            <Text style={styles.weatherValue}>
              {weatherData.temperature}°C
            </Text>
          </View>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLabel}>Humidity</Text>
            <Text style={styles.weatherValue}>{weatherData.humidity}%</Text>
          </View>
          <View style={styles.weatherInfo}>
            <Text style={styles.weatherLabel}>Condition</Text>
            <Text style={styles.weatherValue}>{weatherData.condition}</Text>
          </View>
        </View>
      )}

      {/* Insights Scroll */}
      {insights.length > 0 ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          style={styles.insightsScroll}
        >
          {insights.map((insight) => (
            <View key={insight.id} style={styles.cardWrapper}>
              {renderInsightCard(insight)}
            </View>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No insights available</Text>
        </View>
      )}

      {/* 7-Day Forecast Hint */}
      <TouchableOpacity
        style={styles.forecastCard}
        onPress={() => {
          Alert.alert(
            '7-Day Forecast',
            'Check weather app for detailed 7-day forecast to plan your garden activities better.'
          );
        }}
      >
        <Text style={styles.forecastIcon}>📅</Text>
        <View style={{ flex: 1 }}>
          <Text style={styles.forecastTitle}>7-Day Forecast</Text>
          <Text style={styles.forecastSubtitle}>
            Plan ahead for optimal plant care
          </Text>
        </View>
        <Text style={styles.forecastArrow}>→</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  viewAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 12,
    color: '#00bf63',
    fontWeight: '500',
  },
  weatherInfoContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 12,
    gap: 12,
  },
  weatherInfo: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  weatherLabel: {
    fontSize: 11,
    color: '#999',
    fontWeight: '500',
  },
  weatherValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginTop: 4,
  },
  insightsScroll: {
    marginBottom: 12,
  },
  cardWrapper: {
    paddingHorizontal: 8,
  },
  insightCard: {
    width: 280,
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 8,
  },
  insightHeader: {
    marginBottom: 10,
  },
  insightTitleContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  insightIcon: {
    fontSize: 28,
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  insightContext: {
    fontSize: 12,
    color: '#666',
  },
  insightRecommendation: {
    fontSize: 12,
    color: '#333',
    lineHeight: 16,
    marginBottom: 12,
    fontWeight: '500',
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    borderRadius: 6,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  saveBtnActive: {
    backgroundColor: '#e8f5e9',
    borderColor: '#00bf63',
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  saveBtnTextActive: {
    color: '#00bf63',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#999',
  },
  forecastCard: {
    flexDirection: 'row',
    marginHorizontal: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    alignItems: 'center',
    gap: 12,
  },
  forecastIcon: {
    fontSize: 24,
  },
  forecastTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  forecastSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  forecastArrow: {
    fontSize: 18,
    color: '#ff9800',
  },
});

export default SeasonalInsightsSection;