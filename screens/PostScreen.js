import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

export default function PostScreen() {
  const [products, setProducts] = useState([]);
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [photoUri, setPhotoUri] = useState(null);
  const STORAGE_KEY = '@local_products';

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const data = json != null ? JSON.parse(json) : [];
      setProducts(data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const saveProduct = async (newProduct) => {
    try {
      const updated = [newProduct, ...products];
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      setProducts(updated);
    } catch (err) {
      console.error('Failed to save product:', err);
    }
  };

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'We need access to your media library to pick images.'
        );
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  const handleAddProduct = async () => {
    if (!name || !price || !photoUri) {
      Alert.alert('Missing Fields', 'Please fill in all fields and pick an image.');
      return;
    }

    if (products.length >= 5) {
      Toast.show({
        type: 'error',
        text1: 'Limit Reached',
        text2: 'Only 5 products are allowed per device.',
      });
      return;
    }

    const newProduct = {
      id: Date.now().toString(),
      name,
      price,
      photo: photoUri,
    };

    await saveProduct(newProduct);
    setName('');
    setPrice('');
    setPhotoUri(null);
    Toast.show({ type: 'success', text1: 'Product saved locally!' });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#F9FAFB' }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inner}>
          <Text style={styles.title}>Add Product</Text>

          <TextInput
            placeholder="Product Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />

          <TextInput
            placeholder="Price"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            style={styles.input}
          />

          <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
            <Text style={styles.buttonText}>
              {photoUri ? 'Change Image' : 'Pick Image'}
            </Text>
          </TouchableOpacity>

          {photoUri && (
            <Image source={{ uri: photoUri }} style={styles.preview} />
          )}

          <TouchableOpacity onPress={handleAddProduct} style={styles.button}>
            <Text style={styles.buttonText}>Save Product</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  inner: {
    paddingBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    color: '#111827',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  imagePicker: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#36A2EB',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 12,
    backgroundColor: '#E5E7EB',
  },
});
