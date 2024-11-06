import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ImageBackground, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const HomeScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const userToken = await AsyncStorage.getItem('userToken');
      if (userToken) {
        setIsLoggedIn(true);
        navigation.navigate('TaskList'); // Navega automaticamente para a tela de tarefas
      }
    };
    checkLoginStatus();
  }, []);

  const handleLogin = async () => {
    if (email && password) {
      try {
        const storedUsers = await AsyncStorage.getItem('users');
        const users = storedUsers ? JSON.parse(storedUsers) : [];

        const user = users.find(user => user.email === email && user.password === password);

        if (user) {
          await AsyncStorage.setItem('userToken', email); // Usando e-mail como token
          setIsLoggedIn(true);
          navigation.navigate('TaskList'); // Navega para a tela de tarefas
        } else {
          Alert.alert('E-mail ou senha inválidos.');
        }
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        Alert.alert('Erro', 'Ocorreu um erro ao tentar fazer login.');
      }
    } else {
      Alert.alert('Por favor, insira o e-mail e a senha.');
    }
  };

  return (
    <ImageBackground
      source={{ uri: 'https://mdbootstrap.com/img/Photos/Horizontal/Nature/6-col/img%20(122).jpg' }}
      style={styles.backgroundImage}
    >
      <View style={styles.mask}>
        <View style={styles.formContainer}>
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
          <TouchableOpacity onPress={handleLogin} style={styles.signInButton}>
            <Text style={styles.buttonText}>Sign In</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>
            Not a member? <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>Register</Text>
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: 'center',
  },
  mask: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 47, 75, 0.8)',
    padding: 16,
  },
  formContainer: {
    alignItems: 'center',
    marginTop: 100,
  },
  input: {
    width: '100%',
    padding: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 5,
    color: 'white',
  },
  signInButton: {
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
  registerText: {
    color: 'white',
  },
  registerLink: {
    fontWeight: 'bold',
  },
});

export default HomeScreen;
