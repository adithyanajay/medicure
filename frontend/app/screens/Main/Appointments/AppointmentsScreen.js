import React, { useState, useEffect, useRef } from "react";
import { View, Text, TouchableOpacity, ScrollView, TextInput, Image, Animated } from "react-native";
import { CalendarDays, CheckCircle, UserPlus, Star, Clock, Award, ChevronRight, Building2 } from "lucide-react-native";

// Mock data for doctors with hospital information
const doctorsData = {
  "Cardiology": [
    {
      id: 1,
      name: "Dr. Sarah Johnson",
      specialization: "Cardiology",
      rating: 4.8,
      experience: 12,
      expertise: ["Heart Disease", "Arrhythmia", "Heart Failure"],
      image: "https://randomuser.me/api/portraits/women/1.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "10:30 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-26", day: "Tue", time: "03:30 PM" },
        { date: "2024-03-27", day: "Wed", time: "11:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "09:30 AM" },
      ]
    },
    {
      id: 2,
      name: "Dr. Michael Chen",
      specialization: "Cardiology",
      rating: 4.9,
      experience: 15,
      expertise: ["Interventional Cardiology", "Cardiac Imaging"],
      image: "https://randomuser.me/api/portraits/men/1.jpg",
      hospital: "City Heart Center",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "10:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:30 AM" },
        { date: "2024-03-26", day: "Tue", time: "09:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:30 PM" },
        { date: "2024-03-27", day: "Wed", time: "10:30 AM" },
        { date: "2024-03-27", day: "Wed", time: "03:00 PM" },
        { date: "2024-03-28", day: "Thu", time: "11:00 AM" },
      ]
    }
  ],
  "Dermatology": [
    {
      id: 3,
      name: "Dr. Emily Wilson",
      specialization: "Dermatology",
      rating: 4.7,
      experience: 8,
      expertise: ["Skin Cancer", "Acne", "Eczema"],
      image: "https://randomuser.me/api/portraits/women/2.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:30 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "10:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-27", day: "Wed", time: "09:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "10:30 AM" },
      ]
    }
  ],
  "Neurology": [
    {
      id: 4,
      name: "Dr. James Wilson",
      specialization: "Neurology",
      rating: 4.9,
      experience: 14,
      expertise: ["Epilepsy", "Stroke", "Multiple Sclerosis"],
      image: "https://randomuser.me/api/portraits/men/2.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "10:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-27", day: "Wed", time: "09:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "10:30 AM" },
      ]
    }
  ],
  "Pediatrics": [
    {
      id: 5,
      name: "Dr. Lisa Anderson",
      specialization: "Pediatrics",
      rating: 4.8,
      experience: 10,
      expertise: ["Child Development", "Vaccinations", "Common Illnesses"],
      image: "https://randomuser.me/api/portraits/women/3.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "10:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-27", day: "Wed", time: "09:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "10:30 AM" },
      ]
    }
  ],
  "Psychiatry": [
    {
      id: 6,
      name: "Dr. Robert Smith",
      specialization: "Psychiatry",
      rating: 4.7,
      experience: 12,
      expertise: ["Anxiety", "Depression", "Bipolar Disorder"],
      image: "https://randomuser.me/api/portraits/men/3.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "10:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-27", day: "Wed", time: "09:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "10:30 AM" },
      ]
    }
  ],
  "Radiology": [
    {
      id: 7,
      name: "Dr. Maria Garcia",
      specialization: "Radiology",
      rating: 4.8,
      experience: 11,
      expertise: ["MRI", "CT Scan", "X-ray Interpretation"],
      image: "https://randomuser.me/api/portraits/women/4.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "10:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-27", day: "Wed", time: "09:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "10:30 AM" },
      ]
    }
  ],
  "Orthopedics": [
    {
      id: 8,
      name: "Dr. David Lee",
      specialization: "Orthopedics",
      rating: 4.9,
      experience: 13,
      expertise: ["Joint Replacement", "Sports Injuries", "Fractures"],
      image: "https://randomuser.me/api/portraits/men/4.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "10:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-27", day: "Wed", time: "09:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "10:30 AM" },
      ]
    }
  ],
  "General Medicine": [
    {
      id: 9,
      name: "Dr. Jennifer Brown",
      specialization: "General Medicine",
      rating: 4.7,
      experience: 9,
      expertise: ["General Health", "Preventive Care", "Chronic Conditions"],
      image: "https://randomuser.me/api/portraits/women/5.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "10:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-27", day: "Wed", time: "09:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "10:30 AM" },
      ]
    }
  ],
  "ENT": [
    {
      id: 10,
      name: "Dr. Thomas White",
      specialization: "ENT",
      rating: 4.8,
      experience: 11,
      expertise: ["Ear Disorders", "Nasal Conditions", "Throat Issues"],
      image: "https://randomuser.me/api/portraits/men/5.jpg",
      hospital: "MediCare General Hospital",
      hospitalImage: "https://via.placeholder.com/150",
      availableSlots: [
        { date: "2024-03-25", day: "Mon", time: "09:00 AM" },
        { date: "2024-03-25", day: "Mon", time: "11:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "10:00 AM" },
        { date: "2024-03-26", day: "Tue", time: "02:00 PM" },
        { date: "2024-03-27", day: "Wed", time: "09:00 AM" },
        { date: "2024-03-27", day: "Wed", time: "01:30 PM" },
        { date: "2024-03-28", day: "Thu", time: "10:30 AM" },
      ]
    }
  ]
};

const specializations = [
  "All Specializations",
  "Cardiology",
  "Dermatology",
  "Neurology",
  "Pediatrics",
  "Psychiatry",
  "Radiology",
  "Orthopedics",
  "General Medicine",
  "ENT"
];

const hospitals = [
  "All Hospitals",
  "MediCare General Hospital",
  "City Heart Center",
  "St. Mary's Medical Center",
  "Sunshine Children's Hospital",
  "Metropolitan Health Center"
];

export default function AppointmentBooking({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedSpecialization, setSelectedSpecialization] = useState("All Specializations");
  const [selectedHospital, setSelectedHospital] = useState("All Hospitals");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [formData, setFormData] = useState({ name: "", email: "", description: "" });
  const [step, setStep] = useState(1);
  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // Calculate doctor score based on rating, experience, and expertise
  const calculateDoctorScore = (doctor) => {
    const ratingWeight = 0.4;
    const experienceWeight = 0.3;
    const expertiseWeight = 0.3;
    
    const ratingScore = (doctor.rating / 5) * ratingWeight;
    const experienceScore = (doctor.experience / 20) * experienceWeight;
    const expertiseScore = (doctor.expertise.length / 5) * expertiseWeight;
    
    return (ratingScore + experienceScore + expertiseScore) * 100;
  };

  // Sort doctors by their score
  const sortDoctorsByScore = (doctors) => {
    return doctors.sort((a, b) => calculateDoctorScore(b) - calculateDoctorScore(a));
  };

  // Update available doctors when specialization or hospital changes
  useEffect(() => {
    let filteredDoctors = [];
    
    if (selectedSpecialization === "All Specializations") {
      filteredDoctors = Object.values(doctorsData).flat();
    } else {
      filteredDoctors = doctorsData[selectedSpecialization] || [];
    }

    if (selectedHospital !== "All Hospitals") {
      filteredDoctors = filteredDoctors.filter(doctor => doctor.hospital === selectedHospital);
    }

    setAvailableDoctors(sortDoctorsByScore(filteredDoctors));
  }, [selectedSpecialization, selectedHospital]);

  // Update available slots when doctor is selected
  useEffect(() => {
    if (selectedDoctor) {
      setAvailableSlots(selectedDoctor.availableSlots);
    }
  }, [selectedDoctor]);

  useEffect(() => {
    if (step === 2) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [step]);

  const handleSpecializationSelect = (spec) => {
    setSelectedSpecialization(spec);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleHospitalSelect = (hospital) => {
    setSelectedHospital(hospital);
    setSelectedDoctor(null);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
  };

  const handleSlotSelect = (slot) => {
    setSelectedDate(slot.date);
    setSelectedTime(slot.time);
  };

  const handleBookAppointment = () => {
    if (selectedDoctor && selectedDate && selectedTime) {
      setStep(2);
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFF] p-6">
      {step === 1 && (
        <ScrollView>
          <View className="mb-6">
          <Text className="text-xl font-semibold mb-4">Select Specialization</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
            {specializations.map((spec, index) => (
              <TouchableOpacity
                key={index}
                className={`px-4 py-2 mx-2 rounded-full border ${
                  selectedSpecialization === spec ? "bg-blue-500 text-white" : "border-gray-300"
                }`}
                  onPress={() => handleSpecializationSelect(spec)}
              >
                <Text className={selectedSpecialization === spec ? "text-white" : "text-gray-600"}>{spec}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          </View>

          <View className="mb-6">
            <Text className="text-xl font-semibold mb-4">Select Hospital</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              {hospitals.map((hospital, index) => (
                <TouchableOpacity
                  key={index}
                  className={`px-4 py-2 mx-2 rounded-full border ${
                    selectedHospital === hospital ? "bg-blue-500 text-white" : "border-gray-300"
                  }`}
                  onPress={() => handleHospitalSelect(hospital)}
                >
                  <Text className={selectedHospital === hospital ? "text-white" : "text-gray-600"}>{hospital}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          <View className="mb-6">
            <Text className="text-xl font-semibold mb-4">Available Doctors</Text>
            {availableDoctors.map((doctor) => (
          <TouchableOpacity
                key={doctor.id}
                className={`bg-white rounded-lg p-4 mb-4 shadow-sm ${
                  selectedDoctor?.id === doctor.id ? "border-2 border-blue-500" : ""
                }`}
                onPress={() => handleDoctorSelect(doctor)}
              >
                <View className="flex-row items-center">
                  <Image
                    source={{ uri: doctor.image }}
                    className="w-16 h-16 rounded-full mr-4"
                  />
                  <View className="flex-1">
                    <Text className="text-lg font-semibold">{doctor.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <Star size={16} color="#FFD700" />
                      <Text className="text-gray-600 ml-1">{doctor.rating}</Text>
                      <Clock size={16} color="#666" className="ml-2" />
                      <Text className="text-gray-600 ml-1">{doctor.experience} years</Text>
                    </View>
                    <View className="flex-row flex-wrap mt-2">
                      {doctor.expertise.map((exp, index) => (
                        <Text key={index} className="text-sm text-blue-500 bg-blue-50 px-2 py-1 rounded-full mr-2 mb-1">
                          {exp}
                        </Text>
                      ))}
                    </View>
                  </View>
                </View>
          </TouchableOpacity>
            ))}
          </View>

          {selectedDoctor && (
            <View className="mb-6">
              <Text className="text-xl font-semibold mb-4">Available Time Slots</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
                {availableSlots.map((slot, index) => (
          <TouchableOpacity
                    key={index}
                    className={`p-4 mx-2 rounded-lg border ${
                      selectedDate === slot.date && selectedTime === slot.time
                        ? "bg-blue-500 border-blue-500"
                        : "border-gray-300 bg-white"
                    }`}
                    onPress={() => handleSlotSelect(slot)}
                  >
                    <Text className={selectedDate === slot.date && selectedTime === slot.time ? "text-white" : "text-gray-600"}>
                      {slot.day}
                    </Text>
                    <Text className={selectedDate === slot.date && selectedTime === slot.time ? "text-white" : "text-gray-800"}>
                      {slot.time}
                    </Text>
          </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {selectedDoctor && selectedDate && selectedTime && (
            <View className="mb-6">
              <Text className="text-xl font-semibold mb-4">Appointment Details</Text>
              <View className="bg-white rounded-lg p-4">
                <Text className="text-gray-700 font-semibold">{selectedDoctor.name}</Text>
                <Text className="text-gray-600">{selectedDoctor.specialization}</Text>
                <Text className="text-gray-700 mt-2">{selectedDate} - {selectedTime}</Text>
              </View>
          <TouchableOpacity
            className="bg-blue-500 p-4 mt-6 rounded-lg"
                onPress={handleBookAppointment}
          >
                <Text className="text-white text-center font-semibold">Book Appointment</Text>
          </TouchableOpacity>
        </View>
          )}
        </ScrollView>
      )}

      {step === 2 && (
        <View className="flex-1 items-center justify-center">
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            }}
            className="items-center"
          >
            <View className="w-24 h-24 bg-blue-100 rounded-full items-center justify-center mb-6">
              <CheckCircle size={50} color="#3B82F6" />
        </View>
            
            <Text className="text-2xl font-semibold text-gray-800 mb-2">Appointment Confirmed!</Text>
            <Text className="text-gray-500 mb-8">Your appointment has been successfully scheduled</Text>

            <View className="bg-white rounded-2xl p-6 w-full max-w-md shadow-sm">
              <View className="flex-row items-center mb-4">
                <Image
                  source={{ uri: selectedDoctor.image }}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <View>
                  <Text className="text-xl font-semibold text-gray-800">{selectedDoctor.name}</Text>
                  <Text className="text-gray-500">{selectedDoctor.specialization}</Text>
                </View>
              </View>

              <View className="flex-row items-center mb-4">
                <Building2 size={20} color="#6B7280" className="mr-2" />
                <Text className="text-gray-700">{selectedDoctor.hospital}</Text>
              </View>

              <View className="border-t border-gray-100 pt-4">
                <View className="flex-row items-center mb-2">
                  <CalendarDays size={20} color="#6B7280" className="mr-2" />
                  <Text className="text-gray-700">{selectedDate}</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={20} color="#6B7280" className="mr-2" />
                  <Text className="text-gray-700">{selectedTime}</Text>
                </View>
              </View>

              <View className="mt-6 flex-row justify-between">
                <View className="flex-row items-center">
                  <Star size={20} color="#FFD700" className="mr-1" />
                  <Text className="text-gray-700">{selectedDoctor.rating}</Text>
                </View>
                <View className="flex-row items-center">
                  <Clock size={20} color="#6B7280" className="mr-1" />
                  <Text className="text-gray-700">{selectedDoctor.experience} years experience</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity 
              className="bg-blue-500 p-4 mt-8 rounded-xl w-full max-w-md"
              onPress={() => setStep(1)}
            >
              <Text className="text-white text-center font-semibold text-lg">Back to Home</Text>
          </TouchableOpacity>
          </Animated.View>
        </View>
      )}
    </View>
  );
}
