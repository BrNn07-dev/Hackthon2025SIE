import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";

import * as api from "../api"; 
import { Link } from "expo-router"; 

interface Task {
  id: number;
  title: string;
  description?: string; 
  status: string;
  owner_id: number;
}

export default function LoginScreen() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert("Eroare", "Completează username și parola");
      return;
    }
    try {
      await api.login(username, password);
      setIsLoggedIn(true);
      fetchTasks(); 
    } catch (error) {
      console.error(error);
      Alert.alert("Eroare la login", "Username sau parolă incorectă");
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Eroare", "Nu am putut aduce task-urile");
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsLoggedIn(false);
    setTasks([]);
    setUsername("");
    setPassword("");
  };

  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Sistem de Autentificare</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <View style={styles.buttonContainer}>
          <Button title="Login" onPress={handleLogin} />
        </View>

        <Link href="/register" style={styles.link}>
          Nu ai cont? Înregistraza-te
        </Link>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Task-urile Mele</Text>

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.title}</Text>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </View>
        )}
      />

      <Button title="Reîncarcă Task-uri" onPress={fetchTasks} />

      <Link href="/create-group" style={styles.link}> 
        Creează un grup nou
      </Link>

      <Button title="Logout" onPress={handleLogout} color="red" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#0d2c4f', 
  },
  title: {
    fontSize: 32, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30, 
    color: '#FFC300', 
  },
  input: {
    width: '35%', 
    backgroundColor: 'white',
    height: 40,
    borderColor: '#ffc300ff', 
    borderWidth: 1,
    borderRadius: 8, 
    marginBottom: 15, 
    paddingHorizontal: 15,
    fontSize: 16,
    color: 'hsla(0, 0%, 20%, 1.00)', 
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: "white",
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  description: {
    color: "#ffc300ff",
    marginTop: 5,
  },
  link: {
    marginTop: 15,
    textAlign: "center",
    color: "#ffc300ff",
    fontSize: 16,
  },
});