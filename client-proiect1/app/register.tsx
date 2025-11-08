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

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [nume, setNume] = useState('');
  const [prenume, setPrenume] = useState('');
  const [telefon, setTelefon] = useState('');
  
  const router = useRouter(); 

  const handleRegister = async () => {
    
    
    console.log('--- Se încearcă înregistrarea... ---');

    if (!username || !password || !email || !nume || !prenume) {
      Alert.alert('Eroare', 'Completează toate câmpurile obligatorii (*)');
      return;
    }

    try {
      console.log('Se apelează api.register...');
      
      await api.register({
        username,
        password,
        email,
        nume,
        prenume,
        telefon
      });
      
      console.log('SUCCES! api.register a funcționat.');
      
     
      Alert.alert(
        'Succes', 
        'Cont creat! Te poți loga acum.',
        [{ text: 'OK', onPress: () => router.back() }]
      );

    } catch (error: any) { 
     
      console.error('A APĂRUT O EROARE LA REGISTER:', error);
      
      
      const detail = error.detail || 'O eroare necunoscută a apărut.';
      
      Alert.alert('Eroare la înregistrare', detail);
    }
  }; 
  

  return (
    <SafeAreaView style={styles.container}>
      
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Creare Cont Nou</Text>
        
        <TextInput style={styles.input} placeholder="Username*" value={username} onChangeText={setUsername} autoCapitalize="none" placeholderTextColor="#999"/>
        <TextInput style={styles.input} placeholder="Parolă*" value={password} onChangeText={setPassword} secureTextEntry placeholderTextColor="#999"/>
        <TextInput style={styles.input} placeholder="Email*" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" placeholderTextColor="#999"/>
        
        
        <View style={styles.row}>
          <TextInput style={[styles.input, styles.inputHalf]} placeholder="Nume*" value={nume} onChangeText={setNume} placeholderTextColor="#999"/>
          <TextInput style={[styles.input, styles.inputHalf]} placeholder="Prenume*" value={prenume} onChangeText={setPrenume} placeholderTextColor="#999"/>
        </View>

        <TextInput style={styles.input} placeholder="Telefon (Opțional)" value={telefon} onChangeText={setTelefon} keyboardType="phone-pad" placeholderTextColor="#999"/>
        
        <TouchableOpacity style={styles.buttonPrimary} onPress={handleRegister}>
          <Text style={styles.buttonPrimaryText}>Înregistrează-mă</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.buttonSecondary} onPress={() => router.back()}>
          <Text style={styles.buttonSecondaryText}>Înapoi la pagina principală</Text>
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
    width: '40%', 
    backgroundColor: 'white',
    height: 40, 
    borderColor: '#FFC300', 
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 15,
    paddingHorizontal: 15,
    fontSize: 16,
    color: '#333',
    minWidth: 300, 
  },
  row: {
    width: '40%', 
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10, 
    minWidth: 300,
  },
  inputHalf: {
    flex: 1, 
    width: 'auto', 
    minWidth: 0,
  },
  buttonPrimary: {
    width: '40%', 
    backgroundColor: '#FFC300', 
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    minWidth: 300,
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