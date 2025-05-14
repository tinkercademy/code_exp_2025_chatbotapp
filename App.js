import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert
} from "react-native";
import { StatusBar } from "expo-status-bar";
import axios from "axios";

export default function App() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Local server URL - change the IP address to your computer's local IP address
  // Use your computer's IP address here, not localhost or 127.0.0.1
  // You can find it using `ipconfig` on Windows or `ifconfig` on Mac/Linux
  // For physical devices: replace localhost with your computer's IP address
  // For example: const API_URL = "http://192.168.1.100:3000/api/chat";
  const API_URL = "http://localhost:3000/api/chat";

  const handleSend = async () => {
    if (input.trim() === "") return;

    // Add user message to chat
    const userMessage = { id: Date.now(), text: input, sender: "user" };
    setMessages([...messages, userMessage]);

    // Clear input and set loading
    setInput("");
    setIsLoading(true);

    try {
      // Make API call to our proxy server
      const response = await axios({
        method: "post",
        url: API_URL,
        headers: {
          "Content-Type": "application/json"
        },
        data: {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: input }],
          max_tokens: 1000
        },
        timeout: 30000 // 30 second timeout
      });

      // Add AI response to chat
      if (response.data.choices && response.data.choices.length > 0) {
        const aiMessage = {
          id: Date.now() + 1,
          text: response.data.choices[0].message.content,
          sender: "ai"
        };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });

      // Add detailed error message to chat
      let errorText = "Error connecting to the server. Please try again.";
      if (error.response) {
        // The request was made and the server responded with a status code
        errorText = `API Error (${error.response.status}): ${JSON.stringify(
          error.response.data
        )}`;
      } else if (error.request) {
        // The request was made but no response was received
        errorText = "Network Error: No response received from server.";
        Alert.alert(
          "Connection Error",
          "Could not connect to the API server. Make sure the server is running and accessible from your device."
        );
      }

      const errorMessage = {
        id: Date.now() + 1,
        text: errorText,
        sender: "system"
      };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}>
      <StatusBar style="auto" />

      {/* Chat Input area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={input}
          onChangeText={setInput}
          placeholder="Type your message here..."
          placeholderTextColor="#888"
          multiline
        />
        <TouchableOpacity
          style={[styles.sendButton, isLoading && styles.disabledButton]}
          onPress={handleSend}
          disabled={isLoading}>
          <Text style={styles.sendButtonText}>
            {isLoading ? "..." : "Send"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Messages display area */}
      <ScrollView
        style={styles.messagesContainer}
        contentContainerStyle={styles.messageList}
        inverted>
        {messages
          .slice()
          .reverse()
          .map((message) => (
            <View
              key={message.id}
              style={[
                styles.messageBubble,
                message.sender === "user"
                  ? styles.userMessage
                  : message.sender === "system"
                  ? styles.systemMessage
                  : styles.aiMessage
              ]}>
              <Text
                style={[
                  styles.messageText,
                  message.sender === "user"
                    ? styles.userMessageText
                    : message.sender === "system"
                    ? styles.systemMessageText
                    : styles.aiMessageText
                ]}>
                {message.text}
              </Text>
            </View>
          ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 50
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    backgroundColor: "#fff"
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    padding: 10,
    paddingHorizontal: 15,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
    maxHeight: 100
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: "#007AFF",
    borderRadius: 20,
    width: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  disabledButton: {
    backgroundColor: "#A0CFFF"
  },
  sendButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 10
  },
  messageList: {
    flexGrow: 1,
    paddingVertical: 20
  },
  messageBubble: {
    padding: 10,
    borderRadius: 20,
    marginVertical: 5,
    maxWidth: "80%"
  },
  userMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#007AFF"
  },
  aiMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#E5E5EA"
  },
  systemMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FF3B30"
  },
  messageText: {
    fontSize: 16
  },
  userMessageText: {
    color: "#fff"
  },
  aiMessageText: {
    color: "#000"
  },
  systemMessageText: {
    color: "#fff"
  }
});
