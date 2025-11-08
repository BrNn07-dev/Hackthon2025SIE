import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  FlatList, 
  Alert, 
  SafeAreaView,
  TouchableOpacity 
} from 'react-native';
import * as api from '../../api'; 
import { useRouter } from 'expo-router';


const PRIMARY_BLUE = '#0d2c4f';
const PRIMARY_YELLOW = '#FFC300';

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
      
      {tasks.length === 0 && (
        <Text style={styles.noTasksText}>Nu ai task-uri. Încearcă să le reîncarci.</Text>
      )}

      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.taskItem}>
            <Text style={styles.taskTitle}>{item.title}</Text>
            {item.description && <Text style={styles.description}>{item.description}</Text>}
            <Text style={[styles.statusText, item.status === 'done' ? styles.statusDone : styles.statusInProgress]}>
              Status: {item.status.toUpperCase()}
            </Text>
          </View>
        )}
      />
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonPrimary} onPress={fetchTasks}>
          <Text style={styles.buttonText}>Reîncarcă Task-uri</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonLogout} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: PRIMARY_BLUE, 
  },
  title: {
    fontSize: 28, 
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 10,
    color: PRIMARY_YELLOW, 
  },
  noTasksText: {
    color: PRIMARY_YELLOW,
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
  taskItem: {
    backgroundColor: 'white',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderLeftWidth: 5,
    borderLeftColor: PRIMARY_YELLOW, 
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: PRIMARY_BLUE,
    marginBottom: 5,
  },
  description: {
    color: '#666',
    marginTop: 5,
  },
  statusText: {
    fontSize: 12,
    marginTop: 10,
    fontWeight: 'bold',
  },
  statusDone: {
    color: 'green',
  },
  statusInProgress: {
    color: PRIMARY_BLUE,
  },
  buttonContainer: {
    marginTop: 30,
    gap: 10, 
  },
  buttonPrimary: {
    backgroundColor: PRIMARY_YELLOW, 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonLogout: {
    backgroundColor: 'red', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: PRIMARY_BLUE, 
    fontWeight: 'bold',
    fontSize: 16,
  },
});