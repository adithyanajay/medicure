import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

const Button = ({ 
  onPress, 
  title, 
  variant = 'primary', 
  disabled = false, 
  loading = false,
  className = '',
  ...props 
}) => {
  // Button styles based on variant
  const getButtonStyle = () => {
    const baseStyle = 'rounded-lg py-3 px-4 flex flex-row justify-center items-center';
    
    if (disabled) {
      return `${baseStyle} bg-gray-300 ${className}`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseStyle} bg-blue-500 ${className}`;
      case 'secondary':
        return `${baseStyle} bg-gray-200 ${className}`;
      case 'outline':
        return `${baseStyle} border border-blue-500 ${className}`;
      default:
        return `${baseStyle} bg-blue-500 ${className}`;
    }
  };
  
  // Text styles based on variant
  const getTextStyle = () => {
    const baseStyle = 'font-medium text-center';
    
    if (disabled) {
      return `${baseStyle} text-gray-500`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseStyle} text-white`;
      case 'secondary':
        return `${baseStyle} text-gray-800`;
      case 'outline':
        return `${baseStyle} text-blue-500`;
      default:
        return `${baseStyle} text-white`;
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      className={getButtonStyle()}
      {...props}
    >
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'outline' ? '#3B82F6' : '#FFFFFF'} />
      ) : (
        <Text className={getTextStyle()}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

