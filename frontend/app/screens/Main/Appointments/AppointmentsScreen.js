import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { CalendarDays, CheckCircle, UserPlus } from "lucide-react-native";

const specializations = ["Cardiology", "Dermatology", "Neurology", "Pediatrics", "Psychiatry", "Radiology", "Orthopedics"];

export default function AppointmentBooking({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", description: "", guests: [] });
  const [step, setStep] = useState(1);

  return (
    <View className="flex-1 bg-[#F8FAFF] p-6">
      {step === 1 && (
        <View>
          <Text className="text-xl font-semibold mb-4">Select Specialization</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {specializations.map((spec, index) => (
              <TouchableOpacity
                key={index}
                className={`px-4 py-2 mx-2 rounded-full border ${
                  selectedSpecialization === spec ? "bg-blue-500 text-white" : "border-gray-300"
                }`}
                onPress={() => setSelectedSpecialization(spec)}
              >
                <Text className={selectedSpecialization === spec ? "text-white" : "text-gray-600"}>{spec}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <Text className="text-xl font-semibold mb-4">Select Date & Time</Text>
          <TouchableOpacity
            className="border border-gray-300 p-4 rounded-lg flex-row justify-between items-center mb-4"
            onPress={() => setSelectedDate("March 22, 2024")}
          >
            <Text>{selectedDate || "Choose a date"}</Text>
            <CalendarDays size={20} className="text-gray-500" />
          </TouchableOpacity>
          <TouchableOpacity
            className="border border-gray-300 p-4 rounded-lg flex-row justify-between items-center"
            onPress={() => setSelectedTime("09:30 AM - 10:00 AM")}
          >
            <Text>{selectedTime || "Choose a time"}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-blue-500 p-4 mt-6 rounded-lg"
            onPress={() => setStep(2)}
          >
            <Text className="text-white text-center font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 2 && (
        <View>
          <Text className="text-xl font-semibold mb-4">Information Detail</Text>
          <TextInput
            className="w-full border border-gray-300 p-3 rounded-lg mb-4"
            placeholder="Full Name"
            value={formData.name}
            onChangeText={(text) => setFormData({ ...formData, name: text })}
          />
          <TextInput
            className="w-full border border-gray-300 p-3 rounded-lg mb-4"
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => setFormData({ ...formData, email: text })}
          />
          <TextInput
            className="w-full border border-gray-300 p-3 rounded-lg mb-4"
            placeholder="Description (Optional)"
            value={formData.description}
            onChangeText={(text) => setFormData({ ...formData, description: text })}
          />
          <TouchableOpacity
            className="bg-blue-500 p-4 mt-6 rounded-lg"
            onPress={() => setStep(3)}
          >
            <Text className="text-white text-center font-semibold">Continue</Text>
          </TouchableOpacity>
        </View>
      )}

      {step === 3 && (
        <View className="items-center">
          <CheckCircle size={50} className="text-blue-500 mb-4" />
          <Text className="text-2xl font-semibold mb-2">Confirmed</Text>
          <Text className="text-gray-500 mb-4">You are scheduled with a specialist</Text>
          <Text className="text-gray-700">{formData.name}</Text>
          <Text className="text-gray-700">{formData.email}</Text>
          <Text className="text-gray-700">{selectedDate} - {selectedTime}</Text>
          <TouchableOpacity className="bg-blue-500 p-4 mt-6 rounded-lg" onPress={() => setStep(1)}>
            <Text className="text-white text-center font-semibold">Back to Home</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
