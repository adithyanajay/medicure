import { Tabs } from "expo-router";
import { FontAwesome } from "@expo/vector-icons";
import { COLORS } from "./constants/colors";
import "../global.css"

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: { backgroundColor: COLORS.white, borderTopWidth: 0 },
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.secondary,
      }}
    >
      <Tabs.Screen
        name="mental-health"
        options={{
          title: "Mental Health",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="medkit" size={size} color={color} />
          ),
        }}
      />
       <Tabs.Screen
        name="appointments/index"
        options={{ tabBarLabel: "Appointments", tabBarIcon: ({ color }) => <FontAwesome name="calendar" size={24} color={color} /> }}
      />
  
      <Tabs.Screen
        name="emergency-call"
        options={{
          title: "Emergency",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="phone" size={size} color="red" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="user" size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
