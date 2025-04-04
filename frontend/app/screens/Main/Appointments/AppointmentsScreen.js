import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function HomePage() {
  const [symptoms, setSymptoms] = React.useState({
    temperature: false,
    shuffle: true,  // Default checked as in the image
    he: false
  });

  const toggleSymptom = (symptom) => {
    setSymptoms(prev => ({
      ...prev,
      [symptom]: !prev[symptom]
    }));
  };

  return (
    <View className="flex-1 bg-white px-5 pt-12">
      <StatusBar style="dark" />
      
      {/* Header - Exact match for name styling */}
      <Text className="text-3xl font-bold text-black mb-8">Elsie Adkins</Text>
      
      {/* Clinic/Home visit section - Plain text as in image */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-black mb-1">Clinic visit</Text>
        <Text className="text-gray-500 text-base mb-4">Make an appointment</Text>
        
        <Text className="text-lg font-semibold text-black mb-1">Home visit</Text>
        <Text className="text-gray-500 text-base">Call the doctor home</Text>
      </View>
      
      {/* Divider - Matches the thin gray line */}
      <View className="h-px bg-gray-300 my-4" />
      
      {/* Symptoms section - Exact checkbox styling */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-700 mb-4">What are your symptoms?</Text>
        
        {/* Temperature checkbox */}
        <TouchableOpacity 
          className="flex-row items-center mb-3"
          onPress={() => toggleSymptom('temperature')}
        >
          <View className={`w-5 h-5 border ${symptoms.temperature ? 'bg-blue-500 border-blue-500' : 'border-gray-400'} rounded mr-3 flex items-center justify-center`}>
            {symptoms.temperature && <Text className="text-white text-xs">✓</Text>}
          </View>
          <Text className="text-gray-800">Temperature</Text>
        </TouchableOpacity>
        
        {/* Shuffle checkbox (pre-checked) */}
        <TouchableOpacity 
          className="flex-row items-center mb-3"
          onPress={() => toggleSymptom('shuffle')}
        >
          <View className={`w-5 h-5 border ${symptoms.shuffle ? 'bg-blue-500 border-blue-500' : 'border-gray-400'} rounded mr-3 flex items-center justify-center`}>
            {symptoms.shuffle && <Text className="text-white text-xs">✓</Text>}
          </View>
          <Text className="text-gray-800">Shuffle</Text>
        </TouchableOpacity>
        
        {/* He checkbox */}
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => toggleSymptom('he')}
        >
          <View className={`w-5 h-5 border ${symptoms.he ? 'bg-blue-500 border-blue-500' : 'border-gray-400'} rounded mr-3 flex items-center justify-center`}>
            {symptoms.he && <Text className="text-white text-xs">✓</Text>}
          </View>
          <Text className="text-gray-800">He</Text>
        </TouchableOpacity>
      </View>
      
      {/* Divider */}
      <View className="h-px bg-gray-300 my-4" />
      
      {/* Popular doctors section - Exact text styling */}
      <View className="mb-8">
        <Text className="text-lg font-semibold text-gray-700 mb-4">Popular doctors</Text>
        
        {/* Dr. Chris Frazier */}
        <View className="mb-4">
          <Text className="text-lg font-semibold text-black">Dr. Chris Frazier</Text>
          <Text className="text-gray-500 mb-1">Pediatrician</Text>
          <Text className="text-gray-700">[5.0]</Text>
        </View>
        
        {/* Dr. Viola Dunn */}
        <View>
          <Text className="text-lg font-semibold text-black">Dr. Viola Dunn</Text>
          <Text className="text-gray-500 mb-1">Therapist</Text>
          <Text className="text-gray-700">[4.9]</Text>
        </View>
      </View>
    </View>
  );
}