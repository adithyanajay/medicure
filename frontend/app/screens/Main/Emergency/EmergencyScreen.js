import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, Modal, ActivityIndicator, Linking, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Location from 'expo-location';

export default function EmergencyScreen() {
  const [location, setLocation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);
  const [sentStatus, setSentStatus] = useState(null);

  // Try multiple backend URLs until one works
  const tryBackendUrls = async (endpoints, data) => {
    // URLs to try - include localhost, 10.0.2.2 for emulators, and a real IP if available
    const baseUrls = [
      "http://10.0.2.2:8000",     // Android emulator
      "http://localhost:8000",    // iOS simulator
      "http://127.0.0.1:8000",    // Local machine
      "http://192.168.1.8:8000",  // Your actual Wi-Fi IP address
      "http://192.168.137.1:8000" // Your VMware network adapter IP
    ];
    
    for (const baseUrl of baseUrls) {
      try {
        const url = `${baseUrl}${endpoints}`;
        console.log(`Trying to connect to: ${url}`);
        const response = await axios.post(url, data, { timeout: 5000 });
        console.log(`Connection successful to: ${baseUrl}`);
        return { success: true, response, baseUrl };
      } catch (error) {
        console.log(`Failed to connect to ${baseUrl}:`, error.message);
      }
    }
    
    return { success: false, error: "All connection attempts failed" };
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
    })();
  }, []);

  const getLocation = async () => {
    try {
      setIsLoading(true);
      let location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(location);
      return location;
    } catch (error) {
      setErrorMsg('Could not get your location. Please try again.');
      console.error(error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyPress = async () => {
    await getLocation();
    setShowConfirmation(true);
  };

  const callEmergency = () => {
    // Send SMS instead of making a call
    if (!location) {
      Alert.alert('Location Error', 'Unable to get your location. SMS cannot be sent.');
      return;
    }
    
    sendEmergencySMS();
  };

  const sendEmergencySMS = async () => {
    setIsLoading(true);
    setSentStatus('Sending emergency alert...');
    
    try {
      const result = await tryBackendUrls("/emergency/send-alert", {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        timestamp: new Date().toISOString(),
        emergency_type: "URGENT MEDICAL EMERGENCY - NO RESPONSE NEEDED",
        additional_info: "Patient may be unresponsive. Please dispatch emergency services immediately."
      });
      
      if (result.success) {
        const response = result.response;
        
        if (response.data.success) {
          if (response.data.demo_mode) {
            setSentStatus('Demo: Emergency alert simulated!');
            Alert.alert(
              'Demo Mode', 
              'In a real environment, emergency services would receive an automated alert with your location and critical information.',
              [{ text: 'OK' }]
            );
          } else {
            setSentStatus('Emergency alert sent successfully!');
            Alert.alert(
              'Alert Sent', 
              'Emergency services have been notified with your location. Help is on the way.',
              [{ text: 'OK' }]
            );
          }
        } else {
          Alert.alert('Error', 'Failed to send emergency alert.');
        }
      } else {
        console.error('Connection error:', result.error);
        Alert.alert(
          'Connection Error', 
          'Could not connect to emergency services. Please try again or call directly.',
          [
            { 
              text: 'Call Now', 
              onPress: () => {
                const emergencyNumber = '8330085070';
                Linking.openURL(`tel:${emergencyNumber}`);
              }
            },
            { text: 'Cancel', style: 'cancel' }
          ]
        );
      }
    } catch (error) {
      console.error('Emergency alert error:', error);
      Alert.alert('Error', 'Failed to send emergency alert. Please try again.');
    } finally {
      setIsLoading(false);
      setSentStatus(null);
      if (showConfirmation) {
        setShowConfirmation(false);
      }
    }
  };

  const handleConfirmEmergency = async () => {
    if (!location) {
      Alert.alert('Location Error', 'Unable to get your location. Please try again.');
      setShowConfirmation(false);
      return;
    }
    
    await sendEmergencySMS();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency Services</Text>
        <Text style={styles.subtitle}>Press the button below in case of emergency</Text>
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
        <Ionicons name="medkit" size={50} color="#fff" />
        <Text style={styles.buttonText}>EMERGENCY</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          This will send an automated alert with your location to emergency services. No talking required.
        </Text>
        <TouchableOpacity style={styles.callButton} onPress={callEmergency}>
          <Text style={styles.callButtonText}>Send Emergency Alert Directly</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={showConfirmation}
        onRequestClose={() => setShowConfirmation(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Emergency Alert</Text>
            <Text style={styles.modalText}>
              Are you sure you want to send your location to emergency services?
            </Text>
            
            {sentStatus && (
              <View style={styles.statusContainer}>
                <Text style={styles.statusText}>{sentStatus}</Text>
                {isLoading && <ActivityIndicator size="small" color="#E53935" />}
              </View>
            )}
            
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setShowConfirmation(false)}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmEmergency}
                disabled={isLoading}
              >
                <Text style={styles.modalButtonText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  },
  infoText: {
    color: '#616161',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  callButton: {
    backgroundColor: '#EEEEEE',
    padding: 15,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
  },
  callButtonText: {
    color: '#424242',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#E53935',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 24,
    textAlign: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statusText: {
    fontSize: 16,
    color: '#E53935',
    marginRight: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#EEEEEE',
  },
  confirmButton: {
    backgroundColor: '#E53935',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#424242',
  },
});
