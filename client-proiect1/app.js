import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
// Importăm funcțiile din noul nostru fișier!
import * as api from './api'; 

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      await api.login(username, password); // Folosim funcția din api.js
      setIsLoggedIn(true);
      fetchTasks(); // Încarcă task-urile după login
    } catch (error) {
      console.error("Eroare la login:", error.detail);
      alert(error.detail);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks(); // Folosim funcția din api.js
      setTasks(data);
    } catch (error) {
      console.error("Eroare la aducerea task-urilor:", error.detail);
      // Probabil token-ul a expirat, ar trebui să dăm logout
    }
  };

  // ... Aici pui UI-ul (JSX) ...
  
  if (!isLoggedIn) {
    return (
      <View>
        <TextInput placeholder="Username" onChangeText={setUsername} value={username} />
        <TextInput placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
        <Button title="Login" onPress={handleLogin} />
        {/* Poți adăuga și un formular de înregistrare */}
      </View>
    );
  }

  return (
    <View>
      <Text>Bine ai venit!</Text>
      <Button title="Încarcă Task-uri" onPress={fetchTasks} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <Text>{item.title}</Text>}
      />
      {/* Poți adăuga un formular pentru a crea task-uri noi */}
    </View>
  );
}