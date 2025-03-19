import { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { DOCTORS } from "../../data/doctors";

export default function SelectDoctor({ selectedHospital, selectedCategory, setSelectedDoctor, nextStep, prevStep }) {
  const doctors = DOCTORS[selectedHospital]?.[selectedCategory] || [];
  console.log(selectedHospital)
  console.log(selectedCategory)
  console.log(doctors)

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold text-center text-black mb-4">Select a Doctor</Text>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        {doctors.map((doctor, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center p-4 mb-3 bg-blue-100 rounded-2xl border border-blue-300 shadow-md"
            onPress={() => { setSelectedDoctor(doctor); nextStep(); }}
          >
            <Image source={{ uri: doctor.image }} className="w-16 h-16 rounded-full mr-4 border border-blue-400" />
            <View>
              <Text className="text-lg font-semibold text-black">{doctor.name}</Text>
              <Text className="text-gray-600">{selectedCategory}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="p-4 bg-gray-300 rounded-lg" onPress={prevStep}>
          <Text className="text-black font-bold">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`p-4 rounded-lg ${doctors.length > 0 ? "bg-green-500" : "bg-gray-300"}`}
          onPress={nextStep}
          disabled={doctors.length === 0}
        >
          <Text className="text-white font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
