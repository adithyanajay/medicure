import "../global.css"

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./navigation/AuthNavigator";
import MainNavigator from "./navigation/MainNavigator";
import { AuthProvider, useAuth } from "./context/AuthContext";

function RootNavigator() {
  const { user } = useAuth(); 

  return user ? <MainNavigator /> : <AuthNavigator />;
}

export default function App() {
  return (
    <AuthProvider>
   
        <RootNavigator />
      
    </AuthProvider>
  );
}
