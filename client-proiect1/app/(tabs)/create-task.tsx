import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TextInput, 
  Button, 
  Alert, 
  SafeAreaView, 
  ScrollView, 
  Platform 
} from 'react-native';
import * as api from '../../api'; 
import { useRouter } from 'expo-router';

import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function CreateTaskScreen() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  
 
  const [deadline, setDeadline] = useState<Date | undefined>(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const router = useRouter();

 
  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || deadline;
    setShowPicker(Platform.OS === 'ios'); // Pe iOS rămâne deschis
    setDeadline(currentDate);
  };

  const handleCreateTask = async () => {
    if (!title || !deadline) {
      Alert.alert('Eroare', 'Titlul și termenul limită sunt obligatorii.');
      return;
    }

    try {
      
      const deadlineString = deadline.toISOString();

      await api.createTask(title, description, deadlineString);
      
      Alert.alert('Succes', 'Task-ul a fost creat!', [
        { text: 'OK', onPress: () => {
          
          setTitle('');
          setDescription('');
          setDeadline(new Date());
          
          router.push('/(tabs)'); 
        }}
      ]);
    } catch (error: any) {
      console.error(error);
      const detail = error.detail || 'A apărut o eroare la crearea task-ului.';
      Alert.alert('Eroare', detail);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Creează un Task Nou</Text>
        
        <TextInput
          style={styles.input}
          placeholder="Titlul task-ului *"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          style={[styles.input, styles.inputDescription]}
          placeholder="Descriere (opțional)"
          value={description}
          onChangeText={setDescription}
          multiline={true}
          numberOfLines={4}
        />

        <View style={styles.datePickerContainer}>
          <Text style={styles.dateLabel}>Termen Limită *:</Text>
         
          {Platform.OS !== 'ios' && (
            <Button title="Alege Data" onPress={() => setShowPicker(true)} />
          )}

       
          <Text style={styles.dateText}>
            {deadline ? deadline.toLocaleDateString('ro-RO') : 'Nicio dată selectată'}
          </Text>
        </View>

       
        {(showPicker || Platform.OS === 'ios') && (
          <DateTimePicker
            testID="dateTimePicker"
            value={deadline || new Date()}
            mode="date"
            is24Hour={true}
            display="default"
            onChange={onDateChange}
            minimumDate={new Date()} 
          />
        )}
        
        <View style={styles.buttonSpacer} />
        <Button 
          title="Adaugă Task" 
          onPress={handleCreateTask} 
        />
      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  input: {
    backgroundColor: 'white',
    height: 44,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  inputDescription: {
    height: 100, 
    textAlignVertical: 'top', 
  },
  datePickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  buttonSpacer: {
    height: 20,
  }
});