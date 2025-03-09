import React from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useProfile } from "../../context/ProfileContext";
import { useRouter } from "expo-router";

export default function HeightWeightPage() {
  const router = useRouter();
  const { profileData, updateProfileData } = useProfile();

  const handleNext = () => {
    if (!profileData.height || !profileData.weight) {
      Alert.alert("Error", "Please enter your height and weight.");
      return;
    }

    // Validate height and weight are numbers
    if (isNaN(profileData.height)) {
      Alert.alert("Error", "Height must be a number.");
      return;
    }
    if (isNaN(profileData.weight)) {
      Alert.alert("Error", "Weight must be a number.");
      return;
    }

    router.push("/profile/submit");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold mb-6 text-blue-600">Height & Weight</Text>

      <TextInput
        className="w-full p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50"
        placeholder="Height (e.g., 175 cm)"
        value={profileData.height}
        onChangeText={(text) => updateProfileData("height", text)}
        keyboardType="numeric"
      />

      <TextInput
        className="w-full p-4 mb-6 border border-gray-200 rounded-lg bg-gray-50"
        placeholder="Weight (e.g., 70 kg)"
        value={profileData.weight}
        onChangeText={(text) => updateProfileData("weight", text)}
        keyboardType="numeric"
      />

      <TouchableOpacity
        className="w-full bg-blue-600 p-4 rounded-lg shadow-lg mt-6"
        onPress={handleNext}
      >
        <Text className="text-white text-center font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  );
}