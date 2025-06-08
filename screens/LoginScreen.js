import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firbaseConfig';
import { useDispatch } from 'react-redux';
import { setUser } from '../redux/authSlice';
import { cleanFirebaseUser } from '../utils/cleanUser';

export default function LoginScreen({ navigation }) {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

    const handleLogin = async () => {
    if (!email || !password) {
        Alert.alert('Error', 'Please fill in both email and password.');
        return;
    }

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const safeUser = cleanFirebaseUser(userCredential.user);
        dispatch(setUser(safeUser));
        navigation.replace('Home');
    } catch (error) {
        Alert.alert('Login Failed', error.message);
    }
    };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#ffffff', '#e0f3ff']} style={styles.gradient}>
        <View style={styles.inner}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Login to continue</Text>

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

          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>
            Don't have an account?{' '}
            <Text style={styles.registerLink} onPress={() => navigation.navigate('Register')}>
              Sign up
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
    marginBottom: 28,
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
