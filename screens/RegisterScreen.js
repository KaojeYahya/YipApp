import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firbaseConfig';

import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { cleanFirebaseUser } from '../utils/cleanUser';

export default function RegisterScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, {
        displayName: name.trim(),
      });

      const cleanUser = cleanFirebaseUser(userCredential.user);
      dispatch(setUser(cleanUser));

      Alert.alert('Success', 'Account created successfully!');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Registration Failed', error.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ffffff', '#e0f3ff']} style={styles.gradient}>
        <View style={styles.inner}>
          <Text style={styles.title}>Create Your Account</Text>
          <Text style={styles.subtitle}>Sign up to get started</Text>

          <TextInput
            placeholder="Full Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              style={styles.passwordInput}
              secureTextEntry={!passwordVisible}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setPasswordVisible(!passwordVisible)}>
              <Ionicons name={passwordVisible ? 'eye' : 'eye-off'} size={22} color="#777" />
            </TouchableOpacity>
          </View>

          <View style={styles.passwordContainer}>
            <TextInput
              placeholder="Confirm Password"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.passwordInput}
              secureTextEntry={!confirmPasswordVisible}
              autoCapitalize="none"
            />
            <TouchableOpacity onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}>
              <Ionicons
                name={confirmPasswordVisible ? 'eye' : 'eye-off'}
                size={22}
                color="#777"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Register</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>
            Already have an account?{' '}
            <Text style={styles.registerLink} onPress={() => navigation.goBack()}>
              Login
            </Text>
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  inner: {
    paddingVertical: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  input: {
    backgroundColor: '#f1f5f9',
    padding: 14,
    borderRadius: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  passwordContainer: {
    backgroundColor: '#f1f5f9',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#60B5FF',
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#60B5FF',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '600',
  },
  registerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  registerLink: {
    color: '#60B5FF',
    fontWeight: '500',
  },
});
