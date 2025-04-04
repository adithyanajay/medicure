import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
// import { useAuth } from "../../context/AuthContext";

export default function SignupScreen({ navigation }) {
//   const { signup } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

//   const handleSignup = () => {
//     if (fullName && email && password && password === confirmPassword) {
//       signup({ fullName, email }); // Mock signup, replace with API call
//     }
//   };

  return (
    <View className="flex-1 bg-[#F8FAFF] px-6 justify-center items-center">
      <Text className="text-2xl font-bold text-gray-800 mb-2">Create an account</Text>
      <Text className="text-gray-500 text-center mb-6">
        Join us today by filling in your details below
      </Text>

      <View className="w-full bg-white p-4 rounded-2xl shadow-md">
        <TextInput
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
        />

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

        <TextInput
          className="w-full border border-gray-300 p-3 rounded-lg mb-4"
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity
          className="w-full bg-blue-500 p-3 rounded-lg items-center"
         
        >
          <Text className="text-white font-semibold">Sign Up</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Login")} className="mt-6">
        <Text className="text-blue-500">Already have an account? <Text className="font-bold">Log In</Text></Text>
      </TouchableOpacity>
    </View>
  );
}