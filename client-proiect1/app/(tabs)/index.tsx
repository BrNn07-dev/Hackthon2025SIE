// În fișierul: app/(tabs)/index.tsx

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
// Importăm funcțiile din fișierul api.js
// Asigură-te că calea este corectă. Ar trebui să fie:
import * as api from "../../api";

// <-- SCHIMBARE 1: Definim tipul de date pentru un Task
// Acest lucru va repara eroarea 'type never'
interface Task {
  id: number;
  title: string;
  description?: string; // ? înseamnă opțional
  status: string;
  owner_id: number;
}

export default function LoginScreen() {
  // Starea pentru formular
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Starea pentru aplicație
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // <-- SCHIMBARE 2: Spunem lui useState că 'tasks' va fi o listă de obiecte 'Task'
  const [tasks, setTasks] = useState<Task[]>([]);

  // --- Funcții pentru butoane ---

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert("Eroare", "Completează username și parola");
      return;
    }
    try {
      await api.register(username, password);
      Alert.alert("Succes", "Cont creat! Acum te poți loga.");
    } catch (error) {
      // <-- SCHIMBARE 3: Tratarea erorii 'unknown'
      console.error(error);
      // Afișăm un mesaj generic, deoarece 'error' este 'unknown'
      Alert.alert(
        "Eroare la înregistrare",
        "A apărut o eroare. Încearcă alt username."
      );
    }
  };

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
      // <-- SCHIMBARE 4: Tratarea erorii 'unknown'
      console.error(error);
      Alert.alert("Eroare la login", "Username sau parolă incorectă");
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      // <-- SCHIMBARE 5: Tratarea erorii 'unknown'
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

  // --- Ce se afișează pe ecran ---

  // Dacă NU ești logat, arată formularul de Login
  if (!isLoggedIn) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.title}>Sistem de Autentificare/Logare </Text>
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
          <Button title="Register" onPress={handleRegister} color="#841584" />
        </View>
      </SafeAreaView>
    );
  }

  // Dacă EȘTI logat, arată lista de task-uri
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Task-urile Mele</Text>

      {/* Acum funcționează deoarece 'item' este de tip 'Task',
        iar TypeScript știe că 'item' are 'id' și 'title' 
      */}
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
      <Button title="Logout" onPress={handleLogout} color="red" />
    </SafeAreaView>
  );
}

// Stilizare
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "white",
    height: 44,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 10,
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
    color: "#555",
    marginTop: 5,
  },
});
