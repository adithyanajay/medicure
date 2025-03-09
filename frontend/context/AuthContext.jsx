import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useRouter } from "expo-router";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          console.log("⚠️ No token found, redirecting to login...");
          return router.replace("/login");
        }

        console.log("🔑 Token found! Verifying with server...");
        const response = await axios.get("http://192.168.31.195:8000/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        router.replace(response.data.profileComplete ? "/(tabs)/home" : "/create-profile");
      } catch (error) {
        console.error("❌ Authentication error:", error);
        router.replace("/login");
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const login = async (username, password) => {
    try {
      const response = await axios.post("http://192.168.31.195:8000/auth/login", {
        username,
        password,
      });

      const { access_token } = response.data;

      // Save token to AsyncStorage
      await AsyncStorage.setItem("token", access_token);

      // Update user state
      setUser({ username });

      // Navigate to the appropriate screen
      router.replace("/(tabs)/home");
    } catch (error) {
      console.error("Login error:", error);
      throw new Error("Login failed");
    }
  };

  const signup = async (username, email, password) => {
    try {
      const response = await axios.post("http://192.168.31.195:8000/auth/signup", {
        username,
        email,
        password,
      });

      const { access_token } = response.data;

      // Save token to AsyncStorage
      await AsyncStorage.setItem("token", access_token);

      // Update user state
      setUser({ username });

      // Navigate to the appropriate screen
      router.replace("/profile/dob");
    } catch (error) {
      console.error("Signup error:", error);
      throw new Error("Signup failed");
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    setUser(null);
    router.replace("/login");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};