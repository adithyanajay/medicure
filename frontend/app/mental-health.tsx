import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Linking, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  response?: any;
}

const EMERGENCY_NUMBERS = {
  'National Suicide Prevention Lifeline': '1-800-273-8255',
  'Crisis Text Line': 'Text HOME to 741741',
  'SAMHSA National Helpline': '1-800-662-4357',
  'Veterans Crisis Line': '1-800-273-8255',
  'Trevor Project (LGBTQ+)': '1-866-488-7386'
};

const API_URL = Platform.select({
  web: 'http://127.0.0.1:8000',
  default: 'http://127.0.0.1:8000',
});

export default function MentalHealthScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    // Add welcome message
    setMessages([
      {
        id: '0',
        text: "Hi, I'm here to listen and support you. How are you feeling today?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        response: {
          type: 'general',
          content: {
            message: "I'm here to listen and support you. How are you feeling today?",
            activities: [
              "🗣️ Share what's on your mind",
              "😊 Tell me about your day",
              "💭 Express any concerns you have"
            ]
          }
        }
      }
    ]);
  }, []);

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/mental-health/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputText,
        }),
      });

      const data = await response.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response.content.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        response: data.response
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm having trouble connecting right now. Please try again.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const renderMessage = (message: Message) => {
    const isBot = message.sender === 'bot';
    
    return (
      <View
        key={message.id}
        style={{
          alignSelf: isBot ? 'flex-start' : 'flex-end',
          maxWidth: '80%',
          marginVertical: 8,
        }}
      >
        <View
          style={{
            backgroundColor: isBot ? '#f0f0f0' : '#0084ff',
            padding: 12,
            borderRadius: 16,
            borderBottomLeftRadius: isBot ? 4 : 16,
            borderBottomRightRadius: isBot ? 16 : 4,
          }}
        >
          <Text style={{ color: isBot ? '#000' : '#fff' }}>{message.text}</Text>
          
          {/* Render activities if present */}
          {isBot && message.response?.content?.activities && (
            <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 8 }}>
              <Text style={{ fontWeight: '600', marginBottom: 4, color: '#444' }}>
                Suggested Activities:
              </Text>
              {message.response.content.activities.map((activity: string, index: number) => (
                <Text key={index} style={{ color: '#666', marginVertical: 2 }}>{activity}</Text>
              ))}
            </View>
          )}

          {/* Render resources if present */}
          {isBot && message.response?.content?.resources && (
            <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: '#ddd', paddingTop: 8 }}>
              <Text style={{ fontWeight: '600', marginBottom: 4, color: '#444' }}>
                Helpful Resources:
              </Text>
              {message.response.content.resources.map((resource: string, index: number) => (
                <Text 
                  key={index} 
                  style={{ color: '#0066cc', marginVertical: 2, textDecorationLine: 'underline' }}
                  onPress={() => Linking.openURL(resource.split(' - ')[1])}
                >
                  {resource}
                </Text>
              ))}
            </View>
          )}

          {/* Render emergency numbers if present */}
          {isBot && message.response?.type === 'emergency' && (
            <View style={{ marginTop: 8, borderTopWidth: 1, borderTopColor: '#ff0000', paddingTop: 8 }}>
              <Text style={{ color: '#ff0000', fontWeight: 'bold', marginBottom: 4 }}>
                Emergency Contact Numbers:
              </Text>
              {message.response.content.emergency_numbers.numbers.map((number: string, index: number) => (
                <Text 
                  key={index} 
                  style={{ color: '#ff0000', fontWeight: '500', marginVertical: 2 }}
                >
                  {number}
                </Text>
              ))}
            </View>
          )}
        </View>
        <Text style={{ fontSize: 12, color: '#666', marginTop: 2 }}>
          {message.timestamp}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Stack.Screen
        options={{
          title: 'Mental Health Support',
          headerStyle: { backgroundColor: '#0084ff' },
          headerTintColor: '#fff',
        }}
      />
      
      <ScrollView
        ref={scrollViewRef}
        style={{ flex: 1, padding: 16 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.map(renderMessage)}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          padding: 16,
          borderTopWidth: 1,
          borderTopColor: '#eee',
          backgroundColor: '#fff',
        }}
      >
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder="Type your message..."
          style={{
            flex: 1,
            marginRight: 12,
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: '#f0f0f0',
            borderRadius: 20,
            fontSize: 16,
          }}
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={isLoading || !inputText.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: isLoading ? '#ccc' : '#0084ff',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <FontAwesome name="send" size={16} color="#fff" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}