import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // Redirect to dashboard if user is authenticated
        router.replace("/(tabs)/home");
      } else {
        // Redirect to login if user is not authenticated
        router.replace("/login");
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-blue-50">
        <ActivityIndicator size="large" color="blue" />
      </View>
    );
  }

  return null; // No need to render anything, the router will handle the redirect
}