import { useState } from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";

export default function SelectCategory({ setSelectedCategory, nextStep, prevStep }) {
  const categories = ["Cardiologist", "Neurologist", "Dermatologist"];
  const [selectedCategory, setCategory] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);

  const handleCategorySelect = (category) => {
    setCategory(category);
    setSelectedCategory(category);
    setShowDropdown(false);
  };

  return (
    <View className="flex-1 p-4 bg-white">
      <Text className="text-xl font-bold text-center text-black mb-4">Select Doctor Category</Text>

      {/* Category Dropdown */}
      <TouchableOpacity
        className="p-4 bg-blue-100 border border-blue-400 rounded-lg mb-4"
        onPress={() => setShowDropdown(!showDropdown)}
      >
        <Text className="text-black">{selectedCategory || "Select Category"}</Text>
      </TouchableOpacity>

      {showDropdown && (
        <View className="bg-white border border-gray-300 rounded-lg shadow-md mb-4">
          <FlatList
            data={categories}
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity
                className="p-3 border-b border-gray-200"
                onPress={() => handleCategorySelect(item)}
              >
                <Text className="text-black">{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      )}

      {/* Navigation Buttons */}
      <View className="flex-row justify-between mt-4">
        <TouchableOpacity className="p-4 bg-gray-300 rounded-lg" onPress={prevStep}>
          <Text className="text-black font-bold">Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className={`p-4 rounded-lg ${selectedCategory ? "bg-green-500" : "bg-gray-300"}`}
          onPress={nextStep}
          disabled={!selectedCategory}
        >
          <Text className="text-white font-bold">Next</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
