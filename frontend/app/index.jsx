import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="flex-1 justify-center items-center space-y-6">
        <Text className="text-3xl font-bold text-gray-800 text-center">
          Welcome to Medicure
        </Text>
        <Text className="text-lg text-gray-600 text-center">
          Your personal healthcare companion
        </Text>
        
        <View className="w-full max-w-md space-y-4">
          <Link href="/mental-health" asChild>
            <TouchableOpacity className="bg-blue-600 p-4 rounded-xl flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="heart-circle" size={24} color="white" />
                <Text className="text-white text-lg font-semibold ml-3">Mental Health Support</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </Link>

          <Link href="/appointements/index" asChild>
            <TouchableOpacity className="bg-green-600 p-4 rounded-xl flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="calendar" size={24} color="white" />
                <Text className="text-white text-lg font-semibold ml-3">Book Appointment</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </Link>

          <Link href="/emergency-call" asChild>
            <TouchableOpacity className="bg-red-600 p-4 rounded-xl flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="phone" size={24} color="white" />
                <Text className="text-white text-lg font-semibold ml-3">Emergency Call</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </Link>

          <Link href="/profile" asChild>
            <TouchableOpacity className="bg-purple-600 p-4 rounded-xl flex-row items-center justify-between">
              <View className="flex-row items-center">
                <Ionicons name="person" size={24} color="white" />
                <Text className="text-white text-lg font-semibold ml-3">Profile</Text>
              </View>
              <Ionicons name="arrow-forward" size={24} color="white" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
} 