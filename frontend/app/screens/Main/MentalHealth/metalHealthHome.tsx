import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Linking, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

interface Resource {
  text: string;
  color: string;
}

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
  response?: {
    type?: string;
    is_emergency?: boolean;
    content: {
      message: string;
      activities?: string[];
      resources?: Resource[];
      immediate_actions?: string[];
    }
  };
}

const API_URL = Platform.select({
  web: 'http://localhost:8000',
  ios: 'http://localhost:8000',
  android: 'http://10.0.2.2:8000',
  default: 'http://localhost:8000',
});

export default function MentalHealthScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
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
      const response = await fetch(`${API_URL}/mental-health/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: inputText }),
      });

      const data = await response.json();

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString(),
        response: {
          type: 'general',
          is_emergency: data.is_emergency,
          content: {
            message: data.message,
            activities: data.suggestions,
            resources: data.resources,
            immediate_actions: data.immediate_actions
          }
        }
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
    const isEmergency = message.response?.is_emergency;

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
          <Text style={{
            color: isEmergency ? '#ff0000' : (isBot ? '#000' : '#fff'),
            fontWeight: isEmergency ? 'bold' : 'normal'
          }}>
            {message.text}
          </Text>

          {isBot && message.response?.content?.activities && (
            <View style={{
              marginTop: 8,
              borderTopWidth: 1,
              borderTopColor: isEmergency ? '#ff0000' : '#ddd',
              paddingTop: 8
            }}>
              <Text style={{
                fontWeight: '600',
                marginBottom: 4,
                color: isEmergency ? '#ff0000' : '#444'
              }}>
                Suggested Activities:
              </Text>
              {message.response.content.activities.map((activity, index) => (
                <Text key={index} style={{
                  color: isEmergency ? '#ff0000' : '#666',
                  marginVertical: 2,
                  fontWeight: isEmergency ? '500' : 'normal'
                }}>
                  {activity}
                </Text>
              ))}
            </View>
          )}

          {isBot && message.response?.content?.immediate_actions && (
            <View style={{
              marginTop: 8,
              borderTopWidth: 1,
              borderTopColor: '#ff0000',
              paddingTop: 8
            }}>
              <Text style={{
                fontWeight: '600',
                marginBottom: 4,
                color: '#ff0000'
              }}>
                Immediate Actions:
              </Text>
              {message.response.content.immediate_actions.map((action, index) => (
                <Text key={index} style={{
                  color: '#ff0000',
                  marginVertical: 2,
                  fontWeight: '500'
                }}>
                  • {action}
                </Text>
              ))}
            </View>
          )}

          {isBot && message.response?.content?.resources && (
            <View style={{
              marginTop: 8,
              borderTopWidth: 1,
              borderTopColor: isEmergency ? '#ff0000' : '#ddd',
              paddingTop: 8
            }}>
              <Text style={{
                fontWeight: '600',
                marginBottom: 4,
                color: isEmergency ? '#ff0000' : '#444'
              }}>
                Helpful Resources:
              </Text>
              {message.response.content.resources.map((resource, index) => {
                const phoneMatch = resource.text.match(/(\d{3}[-.]?\d{3}[-.]?\d{4}|\d{3})/);
                const phone = phoneMatch ? phoneMatch[0] : null;

                return (
                  <Text
                    key={index}
                    style={{
                      color: resource.color === 'red' ? '#ff0000' : '#0066cc',
                      marginVertical: 2,
                      fontWeight: resource.color === 'red' ? '500' : 'normal',
                      textDecorationLine: 'underline'
                    }}
                    onPress={() => {
                      if (phone) {
                        Linking.openURL(`tel:${phone}`);
                      }
                    }}
                  >
                    {resource.text}
                  </Text>
                );
              })}
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
