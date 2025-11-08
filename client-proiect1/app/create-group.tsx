

import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Alert, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity 
} from 'react-native';

import * as api from '../api'; 
import { useRouter } from 'expo-router';

export default function CreateGroupScreen() {
  const [groupName, setGroupName] = useState('');
  const router = useRouter(); 

  const handleCreateGroup = async () => {
    if (!groupName) {
      Alert.alert('Eroare', 'Te rugăm să introduci un nume pentru grup.');
      return;
    }
    try {
    
      await api.createGroup(groupName); 
      
      Alert.alert(
        'Succes', 
        `Grupul "${groupName}" a fost creat!`,
        [{ text: 'OK', onPress: () => router.back() }] 
      );
    } catch (error: any) {
      console.error(error);
      const detail = error.detail || 'A apărut o eroare la crearea grupului.';
      Alert.alert('Eroare', detail);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Creează un Grup Nou</Text>
        
        <TextInput 
          style={styles.input} 
          placeholder="Numele Grupului*" 
          value={groupName} 
          onChangeText={setGroupName} 
          autoCapitalize="sentences"
          placeholderTextColor="#999"
        />
        
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleCreateGroup}>
          <Text style={styles.buttonPrimaryText}>Creează Grupul</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
          <Text style={styles.buttonSecondaryText}>Înapoi</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d2c4f', 
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center', 
    padding: 20,
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
    borderColor: '#FFC300', 
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 20, 
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
  },
  buttonPrimary: {
    width: '25%', 
    backgroundColor: '#FFC300', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonPrimaryText: {
    color: '#0d2c4f', 
    fontWeight: 'bold',
    fontSize: 16,
  },
  buttonSecondary: {
    marginTop: 20,
  },
  buttonSecondaryText: {
    color: '#FFC300', 
    fontSize: 16,
  },
});