import { View, Text, Image, TouchableOpacity, Button, ScrollView } from "react-native";
import { useState } from "react";
import { DOCTORS } from "../../data/doctors";
import { COLORS } from "../../constants/colors";

export default function Confirmation({ prevStep }) {
    return (
      <View className="flex-1 justify-center items-center bg-white p-4">
        <Text className="text-2xl font-bold text-green-600">✅ Appointment Confirmed!</Text>
        <Text className="text-lg text-black mt-2">Your appointment has been successfully booked.</Text>
        <Button title="Back to Home" onPress={prevStep} color={COLORS.primary} />
      </View>
    );
  }
  