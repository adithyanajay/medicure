import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";

export default function LoginScreen({ navigation }) {

    const router = useRouter();
  
    const handleNavigation = (route) => {
      router.push(route);
    };


  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    if (email && password) {
      login({ email }); // Mock login, replace with API call
    }
  };

  return (
    <View className="flex-1 bg-[#F8FAFF] px-6 justify-center items-center">
      <Text className="text-2xl font-bold text-gray-800 mb-2">Log In your account</Text>
     

      <View className="w-full bg-white p-4 rounded-2xl shadow-md">
        <TextInput
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          placeholder="Email Address"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity className="self-end mb-4">
          <Text className="text-blue-500">Forgot password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="w-full bg-blue-500 p-3 rounded-lg items-center"
          onPress={handleLogin}
        >
          <Text className="text-white font-semibold">Log In</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-gray-500 my-4">OR</Text>

      

      <TouchableOpacity onPress={() => handleNavigation('screens/Auth/SignupScreen')} className="mt-6">
        <Text className="text-blue-500">Don't have an account? <Text className="font-bold">Sign Up</Text></Text>
      </TouchableOpacity>
    </View>
  );
}
