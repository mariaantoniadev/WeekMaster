import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const RegisterScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (email && password) {
      try {
        // Verificar se há usuários registrados
        const storedUsers = await AsyncStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];

        // Verificar se o e-mail já está em uso
        if (users.find(user => user.email === email)) {
          Alert.alert('E-mail já em uso. Escolha outro.');
        } else {
          // Adicionar novo usuário à lista
          users.push({ email, password });

          // Armazenar a lista de usuários no AsyncStorage
          await AsyncStorage.setItem('users', JSON.stringify(users));
          Alert.alert('Cadastro realizado com sucesso!');
          navigation.navigate('Home'); // Navegar para a tela de login
        }
      } catch (error) {
        console.error('Erro ao registrar:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar registrar.');
      }
    } else {
      Alert.alert('Por favor, insira o e-mail e a senha.');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#fff"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#fff"
      />
      <TouchableOpacity onPress={handleRegister} style={styles.registerButton}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Text style={styles.loginText}>
        Already a member? <Text style={styles.loginLink} onPress={() => navigation.navigate('Home')}>Login</Text>
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: 'rgba(0, 47, 75, 0.8)',
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    color: 'white',
  },
  registerButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    width: '100%',
    borderRadius: 5,
    marginBottom: 16,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  loginText: {
    color: 'white',
  },
  loginLink: {
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
