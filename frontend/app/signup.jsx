import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useRouter } from "expo-router";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { signup } = useAuth();
  const router = useRouter();

  const handleSignup = async () => {
    await signup(username, email, password);
  };

  return (
    <View className="flex-1 justify-center items-center bg-blue-50 p-4">
      <Text className="text-2xl font-bold mb-6 text-blue-600">Signup</Text>
      <TextInput
        className="w-full p-3 mb-4 border border-blue-200 rounded-lg"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        className="w-full p-3 mb-4 border border-blue-200 rounded-lg"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="w-full p-3 mb-4 border border-blue-200 rounded-lg"
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity
        className="w-full bg-blue-500 p-3 rounded-lg"
        onPress={handleSignup}
      >
        <Text className="text-white text-center">Signup</Text>
      </TouchableOpacity>r
      <TouchableOpacity
        className="mt-4"
        onPress={() => router.push("/login")}
      >
        <Text className="text-blue-500">Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
}