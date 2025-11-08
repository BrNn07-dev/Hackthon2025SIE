import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';

import * as api from './api'; 

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async () => {
    try {
      await api.login(username, password); 
      setIsLoggedIn(true);
      fetchTasks(); 
    } catch (error) {
      console.error("Eroare la login:", error.detail);
      alert(error.detail);
    }
  };

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks(); 
      setTasks(data);
    } catch (error) {
      console.error("Eroare la aducerea task-urilor:", error.detail);
     
    }
  };

  
  if (!isLoggedIn) {
    return (
      <View>
        <TextInput placeholder="Username" onChangeText={setUsername} value={username} />
        <TextInput placeholder="Password" onChangeText={setPassword} value={password} secureTextEntry />
        <Button title="Login" onPress={handleLogin} />
       
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
    </View>
  );
}