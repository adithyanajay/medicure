import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from 'expo-location';

/**
 * Emergency Screen Component
 * 
 * Provides immediate emergency assistance by:
 * 1. Getting user's current location
 * 2. Sending location to emergency services (simulated/real)
 * 3. Directly opening phone dialer with emergency number
 */
export default function EmergencyScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  
  // Emergency phone number - change as needed for your region
  const EMERGENCY_NUMBER = '8330085070';
  
  // API endpoint options - tries multiple endpoints until one works
  const API_ENDPOINTS = [
    "http://192.168.1.8:8000/emergency/send-alert",
    "http://10.0.2.2:8000/emergency/send-alert",
    "http://localhost:8000/emergency/send-alert"
  ];

  useEffect(() => {
    // Request location permissions on component mount
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Location permission required for emergency services');
      }
    })();
  }, []);

  /**
   * Handle emergency button press
   * - Gets location immediately
   * - Initiates phone call
   * - Sends location data in background
   */
  const handleEmergencyPress = async () => {
    setIsLoading(true);
    
    try {
      // 1. Get location (doesn't block the call if it fails)
      let locationData = null;
      try {
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });
        locationData = location;
      } catch (err) {
        console.error("Location error:", err);
        // Continue with the emergency call even if location fails
      }
      
      // 2. Immediately initiate the phone call
      const phoneNumber = `tel:${EMERGENCY_NUMBER}`;
      Linking.openURL(phoneNumber).catch(err => {
        console.error("Call error:", err);
      });
      
      // 3. Send location data in background (doesn't block the call)
      if (locationData) {
        sendLocationInBackground(locationData);
      }
    } catch (error) {
      console.error("Emergency process error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Send location data to backend in background
   * This runs after call is initiated and doesn't block the UI
   */
  const sendLocationInBackground = async (locationData) => {
    if (!locationData) return;
    
    const locationPayload = {
      latitude: locationData.coords.latitude,
      longitude: locationData.coords.longitude,
      timestamp: new Date().toISOString(),
      emergency_type: "URGENT MEDICAL EMERGENCY",
      additional_info: "Emergency assistance requested through MediCure app."
    };
    
    // Try sending to all endpoints without blocking
    API_ENDPOINTS.forEach(endpoint => {
      axios.post(endpoint, locationPayload, { timeout: 5000 })
        .then(response => {
          console.log("Emergency location sent successfully:", response.data);
        })
        .catch(error => {
          console.log(`Failed to send location to ${endpoint}:`, error.message);
        });
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Services</Text>
        <Text style={styles.subtitle}>Press the button for immediate emergency assistance</Text>
      </View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}

      <TouchableOpacity 
        style={styles.emergencyButton} 
        onPress={handleEmergencyPress}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator size="large" color="#fff" />
        ) : (
          <>
            <Ionicons name="medkit" size={50} color="#fff" />
            <Text style={styles.buttonText}>EMERGENCY</Text>
          </>
        )}
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Pressing this button will immediately:
        </Text>
        <Text style={styles.infoDetailText}>
          • Call emergency services at {EMERGENCY_NUMBER}
        </Text>
        <Text style={styles.infoDetailText}>
          • Send your location to emergency responders
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    marginTop: 40,
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#E53935',
  },
  subtitle: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: '#FFEBEE',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
  },
  errorText: {
    color: '#E53935',
    textAlign: 'center',
  },
  emergencyButton: {
    backgroundColor: '#E53935',
    borderRadius: 100,
    width: 200,
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  infoContainer: {
    marginTop: 40,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  infoText: {
    color: '#616161',
    textAlign: 'center',
    marginBottom: 10,
    fontSize: 16,
  },
  infoDetailText: {
    color: '#616161',
    textAlign: 'center',
    marginBottom: 5,
    fontSize: 14,
  },
});
