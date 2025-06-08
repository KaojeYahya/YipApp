import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  View,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

const STORAGE_KEY = '@local_products';

export default function ProfileScreen() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      const data = json != null ? JSON.parse(json) : [];
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    }
  };

  const saveProducts = async (newProducts) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
      setProducts(newProducts);
    } catch (error) {
      console.error('Error saving products:', error);
    }
  };

  const deleteProduct = (id) => {
    Alert.alert(
      'Delete Product',
      'Are you sure you want to delete this product?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            const newProducts = products.filter((p) => p.id !== id);
            saveProducts(newProducts);
          },
        },
      ]
    );
  };

  const renderRightActions = (progress, dragX, item) => {
    return (
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteProduct(item.id)}
      >
        <Ionicons name="trash" size={30} color="white" />
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => (
    <Swipeable
      renderRightActions={(progress, dragX) =>
        renderRightActions(progress, dragX, item)
      }
    >
      <View style={styles.productItem}>
        {item.photo ? (
          <Image source={{ uri: item.photo }} style={styles.productImage} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Ionicons name="image-outline" size={40} color="#ccc" />
          </View>
        )}
        <View style={styles.textContainer}>
          <Text style={styles.productName}>{item.name || 'Unnamed product'}</Text>
          <Text style={styles.productPrice}>${item.price ?? 'N/A'}</Text>
        </View>
      </View>
    </Swipeable>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Your Products</Text>
      {products.length === 0 ? (
        <Text style={styles.noProductsText}>No products found.</Text>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 20, // extra padding for safe spacing
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  noProductsText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#777',
  },
  productItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
  },
  productImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
  },
  imagePlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
  },
  productPrice: {
    fontSize: 14,
    marginTop: 4,
    color: '#555',
  },
  separator: {
    height: 12,
  },
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    borderRadius: 8,
    marginVertical: 6,
  },
});
