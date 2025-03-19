import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { LOCATIONS } from "../../data/locations";

export default function SelectLocation({ setSelectedCity, setSelectedHospital, nextStep }) {
  const [city, setCity] = useState("");
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setHospital] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showHospitalDropdown, setShowHospitalDropdown] = useState(false);

  const handleCityChange = (selectedCity) => {
    setCity(selectedCity);
    setSelectedCity(selectedCity);
    setHospitals(LOCATIONS.find((loc) => loc.city === selectedCity)?.hospitals || []);
    setHospital("");
    setSelectedHospital("");
    setShowCityDropdown(false);
  };

  const handleHospitalChange = (hospital) => {
    setHospital(hospital);
    setSelectedHospital(hospital);
    setShowHospitalDropdown(false);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold text-center text-black mb-4">Select Your Location</Text>

      {/* City Dropdown */}
      <TouchableOpacity
        className="p-4 bg-blue-100 border border-blue-400 rounded-lg mb-4"
        onPress={() => setShowCityDropdown(!showCityDropdown)}
      >
        <Text className="text-black">{city || "Select City"}</Text>
      </TouchableOpacity>

      {showCityDropdown && (
        <View className="bg-white border border-gray-300 rounded-lg shadow-md mb-4">
          <FlatList
            data={LOCATIONS}
            keyExtractor={(item) => item.city}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-3 border-b border-gray-200"
                onPress={() => handleCityChange(item.city)}
              >
                <Text className="text-black">{item.city}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Hospital Dropdown (Only Show if City is Selected) */}
      {hospitals.length > 0 && (
        <>
          <TouchableOpacity
            className="p-4 bg-blue-100 border border-blue-400 rounded-lg mb-4"
            onPress={() => setShowHospitalDropdown(!showHospitalDropdown)}
          >
            <Text className="text-black">{selectedHospital || "Select Hospital"}</Text>
          </TouchableOpacity>

          {showHospitalDropdown && (
            <View className="bg-white border border-gray-300 rounded-lg shadow-md mb-4">
              <FlatList
                data={hospitals}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    className="p-3 border-b border-gray-200"
                    onPress={() => handleHospitalChange(item)}
                  >
                    <Text className="text-black">{item}</Text>
                  </TouchableOpacity>
                )}
              />
            </View>
          )}

          {/* Next Button */}
          <TouchableOpacity
            className={`p-4 rounded-lg ${selectedHospital ? "bg-green-500" : "bg-gray-300"}`}
            onPress={nextStep}
            disabled={!selectedHospital}
          >
            <Text className="text-white text-center font-bold">Next</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}
