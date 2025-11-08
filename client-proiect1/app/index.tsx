import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { useRouter } from 'expo-router';

interface StyledButtonProps {
  title: string;
  onPress: () => void;
  color: string;
  textColor: string;
}

const StyledButton: React.FC<StyledButtonProps> = ({ title, onPress, color, textColor }) => (
  <TouchableOpacity
    style={[styles.button, { backgroundColor: color }]}
    onPress={onPress}
  >
    <Text style={[styles.buttonText, { color: textColor }]}>{title}</Text>
  </TouchableOpacity>
);

export default function HomeScreen() {
  const router = useRouter();

  const colors = {
    background: '#0d2c4f', 
    title: '#FFC300',      
    button: '#FFC300',     
    buttonText: '#0d2c4f'  
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.title }]}>
        Pagina Principală
      </Text>
      
      <StyledButton
        title="Login"
        onPress={() => router.push('./login')}
        color={colors.button}
        textColor={colors.buttonText}
      />

      <StyledButton
        title="Register"
        onPress={() => router.push('/register')}
        color={colors.button}
        textColor={colors.buttonText}
      />

      
      <StyledButton
        title="Task-urile Mele"
        onPress={() => router.push('./index1')}
        color={colors.button}
        textColor={colors.buttonText}
      />

      <StyledButton
        title="Creare Grupuri Utilizatori"
        onPress={() => router.push('/create-group')}
        color={colors.button}
        textColor={colors.buttonText}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#FFC300',
    paddingVertical: 15,       
    borderRadius: 8,           
    width: '100%',              
    alignItems: 'center',      
    marginBottom: 20,          
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});