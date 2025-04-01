import React from 'react';
import { View, Text, TextInput } from 'react-native';

const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  error,
  multiline = false,
  numberOfLines = 1,
  className = '',
  ...props
}) => {
  return (
    <View className="mb-4 w-full">
      {label && (
        <Text className="text-gray-700 mb-2 font-medium">{label}</Text>
      )}
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={numberOfLines}
        className={`bg-gray-100 rounded-lg p-3 text-gray-800 ${error ? 'border border-red-500' : ''} ${className}`}
        {...props}
      />
      {error && (
        <Text className="text-red-500 mt-1 text-xs">{error}</Text>
      )}
    </View>
  );
};

export default Input;



