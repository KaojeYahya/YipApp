import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Text, Avatar, IconButton, Card } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState('');
  const navigation = useNavigation();
  const STORAGE_KEY = '@local_products';

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        const data = json != null ? JSON.parse(json) : [];
        setProducts(data);
        setFilteredProducts(data);
      } catch (err) {
        console.error('Error loading products:', err);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [search, products]);

  const renderItem = ({ item }) => (
    <Card style={styles.productCard}>
      <TouchableOpacity>
        <Card.Cover source={{ uri: item.photo }} style={styles.productImage} />
        <Card.Content style={{ paddingHorizontal: 8, paddingBottom: 12 }}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productPrice}>${item.price}</Text>
        </Card.Content>
      </TouchableOpacity>
    </Card>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Avatar.Image size={40} source={require('../assets/icon.png')} />
          <View style={styles.deliveryInfo}>
            <Text style={styles.label}>DELIVERY ADDRESS</Text>
            <Text style={styles.address}>Umueike Road, Oyo State</Text>
          </View>
          <IconButton icon="bell-outline" size={24} onPress={() => {}} />
        </View>

        <View style={styles.searchContainer}>
          <IconButton icon="magnify" size={20} style={styles.searchIcon} />
          <TextInput
            placeholder="Search products"
            value={search}
            onChangeText={setSearch}
            style={styles.searchInput}
            placeholderTextColor="#888"
          />
        </View>

        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={styles.productRow}
          contentContainerStyle={styles.productList}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  deliveryInfo: {
    flex: 1,
    marginLeft: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#777',
  },
  address: {
    fontSize: 16,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    paddingHorizontal: 8,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    margin: 0,
    padding: 0,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 16,
    paddingLeft: 0,
  },
  productList: {
    paddingBottom: 100,
    paddingTop: 0,
  },
  productRow: {
    justifyContent: 'space-between',
    gap: 16,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#fff',
    marginBottom: 16,
    borderRadius: 0,
  },
  productImage: {
    height: 160,
    resizeMode: 'contain',
    backgroundColor: '#f0f0f0',
    borderRadius: 0,
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 8,
  },
  productPrice: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginTop: 4,
  },
});
