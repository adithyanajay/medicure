import React, { useState } from "react";
import { View, Text, TouchableOpacity, Platform, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useProfile } from "../../context/ProfileContext";
import { useRouter } from "expo-router";

export default function DOBPage() {
  const router = useRouter();
  const { profileData, updateProfileData } = useProfile();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(Platform.OS === "ios");
    if (selectedDate) {
      updateProfileData("dob", selectedDate);
    }
  };

  const handleNext = () => {
    if (!profileData.dob) {
      Alert.alert("Error", "Please select your date of birth.");
      return;
    }
    router.push("/profile/blood-group");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-6">
      <Text className="text-2xl font-bold mb-6 text-blue-600">Date of Birth</Text>

      <TouchableOpacity
        className="w-full p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50"
        onPress={() => setShowDatePicker(true)}
      >
        <Text className="text-gray-600">
          {profileData.dob
            ? profileData.dob.toLocaleDateString()
            : "Select Date of Birth"}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={profileData.dob || new Date(2000, 0, 1)}
          mode="date"
          display="default"
          onChange={onDateChange}
          maximumDate={new Date()}
        />
      )}

      <TouchableOpacity
        className="w-full bg-blue-600 p-4 rounded-lg shadow-lg mt-6"
        onPress={handleNext}
      >
        <Text className="text-white text-center font-semibold">Next</Text>
      </TouchableOpacity>
    </View>
  );
}