import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import { CalendarDays, Clock, Star } from "lucide-react-native";

export default function DoctorBookingScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("Wed 20");
  const dates = ["Mon 18", "Tue 19", "Wed 20", "Thu 21", "Fri 22"];

  return (
    <ScrollView className="flex-1 bg-[#F8FAFF] px-6">
      {/* Doctor Profile Section */}
      <View className="items-center mt-6">
        <Image
          source={require( `../../../../assets/images/doctor1.png`) }
          className="w-32 h-32 rounded-full"
        />
        <Text className="text-2xl font-bold text-gray-800 mt-4">Dr. Hannibal Lector</Text>
        <Text className="text-gray-500">Cardio Specialist - Nanyang Hospital</Text>
        <View className="flex-row items-center mt-2">
          <Star className="text-yellow-500" size={16} />
          <Text className="text-gray-600 ml-1">4.9 (3821 reviews)</Text>
          <Text className="ml-2 text-gray-400">• 4 Years</Text>
        </View>
      </View>

      {/* About Doctor */}
      <Text className="text-gray-600 mt-6">
        Hello, my name is Hannibal, you can call me Hanni. I'm a Cardio Specialist at Victoria General Hospital...
      </Text>

      {/* Schedule Section */}
      <View className="mt-6">
        <View className="flex-row justify-between items-center">
          <Text className="text-lg font-semibold">Make a Schedule</Text>
          <CalendarDays className="text-gray-600" size={20} />
        </View>
        <ScrollView horizontal className="mt-4" showsHorizontalScrollIndicator={false}>
          {dates.map((date, index) => (
            <TouchableOpacity
              key={index}
              className={`px-4 py-2 mx-2 rounded-full border ${
                selectedDate === date ? "bg-blue-500 text-white" : "border-gray-300"
              }`}
              onPress={() => setSelectedDate(date)}
            >
              <Text className={selectedDate === date ? "text-white" : "text-gray-600"}>{date}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Educational Background */}
      <Text className="mt-6 font-semibold">Educational Background</Text>
      <Text className="text-gray-600">Northern Arizona State University, Flagstaff</Text>

      {/* Price & Button */}
      <View className="mt-6 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-blue-500">Rs 150.00 </Text>
        <TouchableOpacity className="bg-blue-500 px-6 py-3 rounded-lg" onPress={() => alert("Appointment Booked")}>
          <Text className="text-white font-semibold">Make Appointment</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
