import React, { useState, useEffect } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView, TextInput } from "react-native";
import { CalendarDays, Star } from "lucide-react-native";
import axios from "axios";

export default function DoctorBookingScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState("Wed 20");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState("");
  const [location, setLocation] = useState("");
  const [specializations, setSpecializations] = useState([]);
  const [selectedSpecialization, setSelectedSpecialization] = useState("All");
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const hospitalsRes = await axios.get("https://yourapi.com/hospitals");
        setHospitals(hospitalsRes.data);

        const specializationsRes = await axios.get("https://yourapi.com/specializations");
        setSpecializations(["All", ...specializationsRes.data]);
      } catch (error) {
        console.error("Error fetching hospitals or specializations:", error);
      }
    };

    fetchFilters();
  }, []);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        let query = selectedSpecialization === "All" ? "" : `specialization=${selectedSpecialization}`;
        if (selectedHospital) query += `&hospital=${selectedHospital}`;
        if (location) query += `&location=${location}`;

        const response = await axios.get(`https://yourapi.com/doctors?${query}`);
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
      }
    };

    fetchDoctors();
  }, [selectedSpecialization, selectedHospital, location]);

  return (
    <ScrollView className="flex-1 bg-[#F8FAFF] px-6">
      {/* Search Hospital */}
      <View className="mt-4">
        <Text className="text-lg font-semibold mb-2">Select Hospital</Text>
        <TextInput
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          placeholder="Enter hospital name"
          value={selectedHospital}
          onChangeText={setSelectedHospital}
        />
      </View>
      
      {/* Location Input */}
      <View className="mt-4">
        <Text className="text-lg font-semibold mb-2">Enter Your Location</Text>
        <TextInput
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          placeholder="Enter your location"
          value={location}
          onChangeText={setLocation}
        />
      </View>
      
      {/* Specialization Filter */}
      <View className="mt-4">
        <Text className="text-lg font-semibold mb-2">Select Specialization</Text>
        <ScrollView horizontal className="mt-4" showsHorizontalScrollIndicator={false}>
          {specializations.map((spec, index) => (
            <TouchableOpacity
              key={index}
              className={`px-4 py-2 mx-2 rounded-full border ${
                selectedSpecialization === spec ? "bg-blue-500" : "border-gray-300"
              }`}
              onPress={() => setSelectedSpecialization(spec)}
            >
              <Text className={selectedSpecialization === spec ? "text-white" : "text-gray-600"}>
                {spec}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
      
      {/* Doctor List */}
      {doctors.length > 0 ? (
        doctors.map((doctor, index) => (
          <View key={index} className="bg-white p-4 rounded-lg shadow-lg mt-6">
            <View className="items-center">
              <Image source={{ uri: doctor.image }} className="w-32 h-32 rounded-full" />
              <Text className="text-2xl font-bold text-gray-800 mt-4">{doctor.name}</Text>
              <Text className="text-gray-500">{doctor.specialization} - {doctor.hospital}</Text>
              <View className="flex-row items-center mt-2">
                <Star className="text-yellow-500" size={16} />
                <Text className="text-gray-600 ml-1">{doctor.rating} ({doctor.reviews} reviews)</Text>
                <Text className="ml-2 text-gray-400">• {doctor.experience} Years</Text>
              </View>
            </View>
            <TouchableOpacity 
              className="bg-blue-500 px-6 py-3 rounded-lg mt-4" 
              onPress={() => alert(`Appointment Booked with ${doctor.name}`)}
            > 
              <Text className="text-white font-semibold text-center">Book Appointment</Text>
            </TouchableOpacity>
          </View>
        ))
      ) : (
        <Text className="text-center text-gray-500 mt-6">No doctors found.</Text>
      )}
    </ScrollView>
  );
}
