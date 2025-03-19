import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { useState } from "react";
import { COLORS } from "../../constants/colors";
import { DOCTORS } from "../../data/doctors"; // ✅ Import from external file

export default function SelectTime({ selectedHospital, selectedCategory, selectedDoctor, setSelectedTime, nextStep, prevStep }) {
  const [selectedSlot, setSelectedSlot] = useState(null);

  // Fetch the selected doctor from the DOCTORS object
  const doctor = DOCTORS[selectedHospital]?.[selectedCategory]?.find(d => d.name === selectedDoctor?.name);
  console.log("selected hospital :", selectedHospital, "selected doctor:" , selectedDoctor); // Debugging step

  // If doctor exists, get available times; otherwise, return an empty array
  const availableTimes = doctor ? doctor.availableTimes : [];


  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold text-center text-black mb-4">Select Appointment Time</Text>
      
      {/* Doctor Info Section */}
      {doctor && (
        <View className="items-center mb-4">
          <Image source={{ uri: doctor.image }} className="w-24 h-24 rounded-full" />
          <Text className="text-lg font-semibold text-black mt-2">{doctor.name}</Text>
        </View>
      )}

      {/* Available Times */}
      <ScrollView contentContainerStyle={{ flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
        {selectedDoctor.availableTimes.map((time, index) => (
          <TouchableOpacity
            key={index}
            className={`p-3 m-2 rounded-lg border ${selectedSlot === time ? "bg-blue-500 border-blue-700" : "bg-blue-200 border-blue-400"}`}
            onPress={() => setSelectedSlot(time)}
          >
            <Text className={`text-black font-medium ${selectedSlot === time ? "text-white" : ""}`}>{time}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Navigation Buttons */}
      <View className="mt-4 flex-row justify-between">
        <TouchableOpacity className="p-3 bg-gray-300 rounded-lg" onPress={prevStep}>
          <Text className="text-black font-medium">Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`p-3 rounded-lg ${selectedSlot ? "bg-green-500" : "bg-gray-300"}`}
          onPress={() => { if (selectedSlot) { setSelectedTime(selectedSlot); nextStep(); } }}
          disabled={!selectedSlot}
        >
          <Text className="text-white font-medium">Confirm</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
