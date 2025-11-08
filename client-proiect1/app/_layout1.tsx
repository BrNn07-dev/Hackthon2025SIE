
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      
      <Stack.Screen
        name="index" 
        options={{
          headerShown: false, 
        }}
      />
      
     
      <Stack.Screen
        name="login" 
        options={{
          title: 'Autentificare', 
        }}
      />

      
      <Stack.Screen
        name="register" 
        options={{
          title: 'Înregistrare',
        }}
      />
      
    
      <Stack.Screen
        name="create-group" 
        options={{
          title: 'Creează Grup',
        }}
      />

      
      <Stack.Screen
        name="(tabs)" 
        options={{
          headerShown: false, 
        }}
      />
    </Stack>
  );
}