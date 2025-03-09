import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { useProfile } from "../../context/ProfileContext";
import { useRouter } from "expo-router";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SubmitPage() {
  const router = useRouter();
  const { profileData, resetProfileData } = useProfile();

  const handleSubmit = async () => {
    try {
      // Retrieve the JWT token from AsyncStorage
      const token = await AsyncStorage.getItem("jwtToken");

      if (!token) {
        throw new Error("No token found");
      }

      // Make the POST request with the JWT token in the header
      const response = await axios.post(
        "http://192.168.31.195:8000/auth/user/profile",
        {
          dob: profileData.dob.toISOString().split("T")[0],
          blood_group: profileData.bloodGroup,
          height: profileData.height + " cm",
          weight: profileData.weight + " kg",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Profile created:", response.data);
      resetProfileData(); // Clear the profile data
      router.replace("/(tabs)/home"); // Redirect to dashboard
    } catch (error) {
      console.error("Error creating profile:", error);
      alert("Failed to create profile");
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold mb-6 text-blue-600">Review & Submit</Text>

      <View className="w-full mb-6">
        <Text className="text-lg text-gray-600">
          Date of Birth: {profileData.dob.toLocaleDateString()}
        </Text>
        <Text className="text-lg text-gray-600">
          Blood Group: {profileData.bloodGroup}
        </Text>
        <Text className="text-lg text-gray-600">
          Height: {profileData.height} cm
        </Text>
        <Text className="text-lg text-gray-600">
          Weight: {profileData.weight} kg
        </Text>
      </View>

      <TouchableOpacity
        className="w-full bg-blue-600 p-4 rounded-lg shadow-lg"
        onPress={handleSubmit}
      >
        <Text className="text-white text-center font-semibold">Submit</Text>
      </TouchableOpacity>
    </View>
  );
}