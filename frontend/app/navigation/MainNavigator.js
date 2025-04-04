import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomeScreen from "../screens/Main/HomeScreen";
import AppointmentsScreen from "../screens/Main/Appointments/AppointmentsScreen";
import EmergencyScreen from "../screens/Main/Emergency/EmergencyScreen";
import SettingsScreen from "../screens/Main/Settings/SettingsScreen";
import { Ionicons } from "@expo/vector-icons";
import QuestionnaireScreen from "../screens/Main/SymtomsPrediction/questionnaire";
import MentalHealth from "../screens/Main/MentalHealth/metalHealthHome";
import { FontAwesome } from '@expo/vector-icons';
const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" color={color} size={size} />
          ),
        }}
      />
       <Tab.Screen
        name="questionnaire"
        component={QuestionnaireScreen}
        options={{
          title: "Symptom Checker",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="stethoscope" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Appointments" 
        component={AppointmentsScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen 
        name="Emergency" 
        component={EmergencyScreen} 
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="call" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="mental-health"
        component={MentalHealth}
        options={{
          title: "Mental Health",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="medkit" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
