import React, { createContext, useState, useContext } from "react";

const ProfileContext = createContext();

export const ProfileProvider = ({ children }) => {
  const [profileData, setProfileData] = useState({
    dob: null,
    bloodGroup: "",
    height: "",
    weight: "",
  });

  const updateProfileData = (key, value) => {
    setProfileData((prev) => ({ ...prev, [key]: value }));
  };

  const resetProfileData = () => {
    setProfileData({
      dob: null,
      bloodGroup: "",
      height: "",
      weight: "",
    });
  };

  return (
    <ProfileContext.Provider
      value={{ profileData, updateProfileData, resetProfileData }}
    >
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);