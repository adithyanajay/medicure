import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

const SymptomCard = ({ symptom, selected, onToggle }) => {
  return (
    <TouchableOpacity
      onPress={() => onToggle(symptom)}
      className={`py-2 px-4 rounded-full m-1 ${
        selected ? 'bg-blue-500' : 'bg-gray-200'
      }`}
    >
      <Text
        className={`${
          selected ? 'text-white' : 'text-gray-800'
        } font-medium`}
      >
        {symptom}
      </Text>
    </TouchableOpacity>
  );
};

export default SymptomCard; 