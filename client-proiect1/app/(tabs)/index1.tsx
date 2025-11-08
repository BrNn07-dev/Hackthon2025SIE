import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Button, FlatList, Alert, SafeAreaView }
from 'react-native';
import * as api from '../../api'; 
import { useRouter } from 'expo-router';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: string;
  owner_id: number;
}

export default function TaskScreen() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const router = useRouter(); 

  const fetchTasks = async () => {
    try {
      const data = await api.getTasks();
      setTasks(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Eroare', 'Nu am putut aduce task-urile. E posibil să fi expirat sesiunea.');
      handleLogout();
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []); 

  const handleLogout = () => {
    api.logout(); 
    
    router.replace('/'); 
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Task-urile Mele</Text>
      
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text>{item.title}</Text>
            {item.description && <Text style={styles.description}>{item.description}</Text>}
          </View>
        )}
      />
      
      <View style={styles.buttonContainer}>
        <Button title="Reîncarcă Task-uri" onPress={fetchTasks} />
        <Button title="Logout" onPress={handleLogout} color="red" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 20,
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 5,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  description: {
    color: '#555',
    marginTop: 5,
  },
  buttonContainer: {
    marginTop: 20,
  }
});