import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function Home() {
  const router = useRouter();

  const handleNavigation = (route) => {
    router.push(route);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar style="dark" />
      
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-3xl font-bold text-blue-600">MediCure</Text>
          <Text className="text-gray-600">Your AI Medical Assistant</Text>
        </View>
        
        {/* Featured Card - Symptom Checker */}
        <TouchableOpacity 
          className="bg-blue-500 rounded-xl overflow-hidden mb-6"
          onPress={() => handleNavigation('/screens/Main/SymtomsPrediction/questionnaire')}
        >
          <View className="p-5">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-white text-xl font-bold mb-2">Symptom Checker</Text>
                <Text className="text-blue-100 mb-3">
                  Describe your symptoms and get an AI-powered diagnosis
                </Text>
                <View className="bg-white rounded-full py-2 px-4 self-start flex-row items-center">
                  <Text className="text-blue-600 font-medium mr-1">Start checkup</Text>
                  <FontAwesome name="arrow-right" size={14} color="#2563EB" />
                </View>
              </View>
              <View className="ml-3">
                <FontAwesome name="stethoscope" size={50} color="rgba(255,255,255,0.8)" />
              </View>
            </View>
          </View>
        </TouchableOpacity>
        
        {/* Quick Action Cards */}
        <Text className="text-lg font-semibold mb-3">Quick Actions</Text>
        <View className="flex-row flex-wrap justify-between mb-6">
          {/* Mental Health Card */}
          <TouchableOpacity 
            className="bg-green-50 rounded-xl p-4 mb-3 w-[48%]"
            onPress={() => handleNavigation('screens/Main/MentalHealth/metalHealthHome')}
          >
            <FontAwesome name="heartbeat" size={30} color="#10B981" />
            <Text className="text-green-800 font-medium mt-3 mb-1">Mental Health</Text>
            <Text className="text-gray-600 text-sm">Assess your mental wellbeing</Text>
          </TouchableOpacity>
          
          {/* Emergency Call Card */}
          <TouchableOpacity 
            className="bg-red-50 rounded-xl p-4 mb-3 w-[48%]"
            onPress={() => handleNavigation('screens/Main/Emergency/EmergencyScreen')}
          >
            <FontAwesome name="phone" size={30} color="#EF4444" />
            <Text className="text-red-800 font-medium mt-3 mb-1">Emergency</Text>
            <Text className="text-gray-600 text-sm">Contact emergency services</Text>
          </TouchableOpacity>
          
          {/* Profile Card */}
          <TouchableOpacity 
            className="bg-amber-50 rounded-xl p-4 mb-3 w-[48%]"
            onPress={() => handleNavigation('/profile')}
          >
            <FontAwesome name="user-md" size={30} color="#F59E0B" />
            <Text className="text-amber-800 font-medium mt-3 mb-1">Your Profile</Text>
            <Text className="text-gray-600 text-sm">Manage your health details</Text>
          </TouchableOpacity>
          
          {/* History Card */}
          <TouchableOpacity 
            className="bg-purple-50 rounded-xl p-4 mb-3 w-[48%]"
            onPress={() => handleNavigation('/questionnaire')}
          >
            <FontAwesome name="history" size={30} color="#8B5CF6" />
            <Text className="text-purple-800 font-medium mt-3 mb-1">History</Text>
            <Text className="text-gray-600 text-sm">View past consultations</Text>
          </TouchableOpacity>
        </View>
        
        {/* Health Tips */}
        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3">Health Tip of the Day</Text>
          <View className="bg-gray-50 rounded-xl p-4">
            <Text className="text-gray-800 font-medium mb-2">Stay Hydrated!</Text>
            <Text className="text-gray-600">
              Drinking enough water each day is crucial for many reasons: to regulate body temperature, 
              keep joints lubricated, prevent infections, deliver nutrients to cells, and keep organs functioning properly.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 