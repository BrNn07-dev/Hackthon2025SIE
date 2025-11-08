import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Alert,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import * as api from "../api";
import { useRouter } from "expo-router";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Eroare", "Completează username și parola");
      return;
    }
    try {
      await api.login(username, password);
      router.replace({ pathname: "./tabs" });
    } catch (error) {
      console.error(error);
      Alert.alert("Eroare la login", "Username sau parolă incorectă");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />

      <TouchableOpacity style={styles.buttonPrimary} onPress={handleLogin}>
        <Text style={styles.buttonPrimaryText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Nu ai cont?</Text>

        <TouchableOpacity onPress={() => router.push("/register")}>
          <Text style={styles.buttonSecondaryText}>Creează un cont</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#0d2c4f",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
    color: "#FFC300",
  },
  input: {
    width: "35%",
    backgroundColor: "white",
    height: 40,
    borderColor: "#FFC300",
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#333",
  },
  buttonPrimary: {
    width: "20%",
    backgroundColor: "#FFC300",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonPrimaryText: {
    color: "#0d2c4f",
    fontWeight: "bold",
    fontSize: 16,
  },
  registerContainer: {
    marginTop: 40,
    alignItems: "center",
  },
  registerText: {
    color: "#FFC300",
    fontSize: 16,
    marginBottom: 10,
  },
  buttonSecondaryText: {
    color: "#FFC300",
    fontWeight: "bold",
    fontSize: 16,
  },
});
