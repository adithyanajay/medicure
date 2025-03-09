import React, { useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import { Menu, Provider } from "react-native-paper";
import { useProfile } from "../../context/ProfileContext";
import { useRouter } from "expo-router";

export default function BloodGroupPage() {
  const router = useRouter();
  const { profileData, updateProfileData } = useProfile();
  const [menuVisible, setMenuVisible] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const handleNext = () => {
    if (!profileData.bloodGroup) {
      Alert.alert("Error", "Please select your blood group.");
      return;
    }
    router.push("/profile/height-weight");
  };

  return (
    <Provider>
      <View className="flex-1 justify-center items-center bg-white p-6">
        <Text className="text-2xl font-bold mb-6 text-blue-600">Blood Group</Text>

        <Menu
          visible={menuVisible}
          onDismiss={() => setMenuVisible(false)}
          anchor={
            <TouchableOpacity
              className="w-full p-4 mb-4 border border-gray-200 rounded-lg bg-gray-50"
              onPress={() => setMenuVisible(true)}
            >
              <Text className="text-gray-600">
                {profileData.bloodGroup || "Select Blood Group"}
              </Text>
            </TouchableOpacity>
          }
        >
          {bloodGroups.map((group) => (
            <Menu.Item
              key={group}
              onPress={() => {
                updateProfileData("bloodGroup", group);
                setMenuVisible(false);
              }}
              title={group}
            />
          ))}
        </Menu>

        <TouchableOpacity
          className="w-full bg-blue-600 p-4 rounded-lg shadow-lg mt-6"
          onPress={handleNext}
        >
          <Text className="text-white text-center font-semibold">Next</Text>
        </TouchableOpacity>
      </View>
    </Provider>
  );
}