// În fișierul: app/create-group.tsx

import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

export default function CreateGroupScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <View>
        <Text style={styles.title}>Creare Grupuri</Text>
        <Text>Aici va fi formularul pentru crearea grupurilor.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
});