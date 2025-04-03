import { Stack } from 'expo-router';
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "./constants/colors";
import "../global.css"
import { AuthProvider } from "../context/AuthContext";

export default function Layout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen
          name="index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="emergency-call"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="mental-health"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="profile"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="appointements/index"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="appointements/steps/SelectCategory"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="appointements/steps/SelectDoctor"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="appointements/steps/SelectLocation"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="appointements/steps/SelectTime"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="appointements/steps/Confirmation"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </AuthProvider>
  );
}
