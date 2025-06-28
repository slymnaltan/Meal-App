import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import axios from "axios";

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollViewRef = useRef();
  
  // Claude API anahtarı - güvenli yönetim için dotenv veya react-native-config kullanmanızı öneririm
  const CLAUDE_API_KEY = "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";

  // Claude API'ye istek göndermek için fonksiyon
  const sendClaudeRequest = async (userMessage) => {
    try {
      const response = await axios.post(
        "https://api.anthropic.com/v1/messages",
        {
          model: "claude-3-haiku-20240307", // En hızlı ve ekonomik model
          max_tokens: 500,
          system: "Sen bir yemek tarifi uygulamasında yardımcı olan bir asistansın. Kullanıcılara tarifler, malzemeler ve pişirme teknikleri hakkında bilgi verirsin.",
          messages: [
            { role: "user", content: userMessage }
          ]
        },
        {
          headers: {
            "Content-Type": "application/json",
            "x-api-key": CLAUDE_API_KEY,
            "anthropic-version": "2023-06-01"
          },
        }
      );
      
      return response.data.content[0].text;
    } catch (err) {
      console.error("Claude API Error:", err.response?.data || err.message);
      throw err;
    }
  };

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    const userMessage = userInput.trim();
    const newUserMessage = {
      role: "user",
      content: userMessage
    };
    
    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setUserInput("");
    setLoading(true);

    try {
      const botResponse = await sendClaudeRequest(userMessage);
      
      const botMessage = {
        role: "assistant",
        content: botResponse
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);
      
      // Otomatik olarak en aşağı kaydır
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
      
    } catch (err) {
      console.error("Chat Error:", err);
      
      if (err.response?.status === 429) {
        alert("Çok fazla istek gönderdin. Lütfen biraz bekle ve tekrar dene.");
      } else if (err.response?.status === 401) {
        alert("API anahtarı geçersiz. Lütfen anahtarınızı kontrol edin.");
      } else {
        alert("Bir hata oluştu. Lütfen tekrar dene.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f5f5f5" }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <ScrollView
        ref={scrollViewRef}
        style={{ padding: 10 }}
        contentContainerStyle={{ paddingBottom: 20 }}
        onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
      >
        {messages.length === 0 ? (
          <View style={{ padding: 18, alignItems: "center", marginTop: 20 }}>
            <Text style={{ fontSize: 21, color: "#069C54", textAlign: "center" }}>
              Merhaba! Ben tarif asistanınız. Bana istediğiniz yemek tarifleri, 
              malzemeler veya pişirme teknikleri hakkında sorular sorabilirsiniz. 🍽
            </Text>
          </View>
        ) : (
          messages.map((msg, index) => (
            <View
              key={index}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                backgroundColor: msg.role === "user" ? "#069C54" : "#F8E9D6",
                borderRadius: 18,
                marginTop:40,
                marginVertical: 5,
                padding: 12,
                maxWidth: "80%",
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 1,
                elevation: 1,
              }}
            >
              <Text
                style={{
                  color: msg.role === "user" ? "#fff" : "#333",
                  fontSize: 16,
                  lineHeight: 22,
                }}
              >
                {msg.content}
              </Text>
            </View>
          ))
        )}

        {loading && (
          <View style={{ padding: 10, alignItems: "center" }}>
            <ActivityIndicator size="small" color="#FF6B6B" />
          </View>
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          backgroundColor: "#fff",
          padding: 10,
          borderTopWidth: 1,
          borderTopColor: "#e0e0e0",
          alignItems: "center",
        }}
      >
        <TextInput
          value={userInput}
          onChangeText={setUserInput}
          placeholder="Bir tarif sorun..."
          style={{
            flex: 1,
            backgroundColor: "#f8f8f8",
            paddingHorizontal: 15,
            paddingVertical: 10,
            borderRadius: 20,
            marginRight: 10,
            fontSize: 16,
          }}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          onPress={sendMessage}
          disabled={loading || !userInput.trim()}
          style={{
            backgroundColor: loading || !userInput.trim() ? "#e0e0e0" : "#FF6B6B",
            width: 45,
            height: 45,
            borderRadius: 22.5,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "#fff", fontSize: 18, fontWeight: "bold" }}>→</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default ChatScreen;