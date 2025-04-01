import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

const OptionButton = ({ option, label, selected, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(option)}
      className={`flex flex-row items-center p-4 mb-3 rounded-lg border ${
        selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
      }`}
    >
      <View className={`h-6 w-6 rounded-full mr-3 flex items-center justify-center ${
        selected ? 'bg-blue-500' : 'bg-gray-200'
      }`}>
        <Text className={`${selected ? 'text-white' : 'text-gray-600'} font-bold`}>
          {option}
        </Text>
      </View>
      <Text className="text-gray-800 flex-1">{label}</Text>
    </TouchableOpacity>
  );
};

export default OptionButton; 