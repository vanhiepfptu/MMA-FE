import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, FlatList, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { fetchProducts } from '../constants/api';
import ProductDetailScreen from './ProductDetailScreen';
import { Picker } from '@react-native-picker/picker';

const ProductCard = ({ product, onPress }) => (
  <TouchableOpacity onPress={() => onPress(product)} style={styles.card}>
    <Image source={{ uri: product.productImage }} style={styles.image} />
    <Text style={styles.name}>{product.productName}</Text>
    <Text style={styles.price}>${product.productPrice}</Text>
  </TouchableOpacity>
);

const ProductScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterCategory, setFilterCategory] = useState('');
  const [sortPrice, setSortPrice] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const categories = ['All', 'Chair', 'Sofa', 'Light', 'Table'];
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryPress = (category) => {
    if (category === 'All') {
      setFilterCategory('');
      setSelectedCategory(category);// Loại bỏ bộ lọc nếu chọn "All"
    } else {
      setFilterCategory(category);
      setSelectedCategory(category);  // Áp dụng bộ lọc nếu chọn danh mục cụ thể
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  const getProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await fetch(`http://10.0.3.2:5000/api/products?page=${page}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setTotalPages(data.totalPages);
      setCurrentPage(data.currentPage);

      if (page > 1) {
        setProducts(prevProducts => [...prevProducts, ...data.data]);
      } else {
        setProducts(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoading(false);
    }
  };
  const CategoryCard = ({ categoryName, onPress, isSelected }) => (
    <TouchableOpacity onPress={onPress} style={[styles.categoryCard, isSelected && styles.selectedCategoryCard]}>
      <Text style={[styles.categoryText, isSelected && styles.selectedCategoryText]}>{categoryName}</Text>
    </TouchableOpacity>
  );
  const filteredProducts = products
    .filter(product =>
      (filterCategory === '' || product.productType === filterCategory) &&
      (searchQuery === '' || product.productName.toLowerCase().includes(searchQuery.toLowerCase()))
    )
    .sort((a, b) => {
      if (sortPrice === 'lowToHigh') {
        return a.productPrice - b.productPrice;
      } else if (sortPrice === 'highToLow') {
        return b.productPrice - a.productPrice;
      }
      return 0;
    });

  const handleLoadMore = () => {
    if (currentPage < totalPages) {
      getProducts(currentPage + 1);
    }
  };

  const goToProductDetails = (product) => {
    navigation.navigate('ProductDetailScreen', { productId: product.productid });
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }




  return (
    <View style={{ flex: 1 }}>
      <TextInput
        style={styles.searchBox}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <View style={styles.categoryContainer}>
        {categories.map((category) => (
          <CategoryCard
            key={category}
            categoryName={category}
            onPress={() => handleCategoryPress(category)}
            isSelected={selectedCategory === category}
          />
        ))}
      </View>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sortPrice}
          onValueChange={(itemValue) => setSortPrice(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="All" value="" />
          <Picker.Item label="Price: Low to High" value="lowToHigh" />
          <Picker.Item label="Price: High to Low" value="highToLow" />
        </Picker>

      </View>

      <FlatList
        data={filteredProducts}
        renderItem={({ item }) => (
          <ProductCard product={item} onPress={() => goToProductDetails(item)} />
        )}
        keyExtractor={item => item.productid}
        numColumns={3}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={loading ? ActivityIndicator : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    margin: 10,
    elevation: 3,
    backgroundColor: '#fff',
    shadowOffset: { width: 1, height: 1 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 2,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15
  },
  selectedCategoryCard: {
    backgroundColor: '#FFA07A', // Màu cam cho card được chọn
  },
  selectedCategoryText: {
    color: '#FFFFFF', // Màu chữ trắng khi được chọn
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  pickerContainer: {
    alignItems: 'flex-end', // Căn `Picker` về phía bên phải
    width: '100%', // Chiếm đủ chiều ngang của container cha
  },

  picker: {
    height: 50,
    width: '30%', // Chiếm 50% chiều ngang của container cha
    // Không cần `alignItems` ở đây
    fontSize: 16,
  },
  price: {
    fontSize: 14,
    color: '#333',
  },
  searchBox: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingLeft: 8,
    margin: 10,
    borderRadius: 5,
    backgroundColor: '#FFFFFF', // Màu nền trắng
    color: '#000000', // Màu chữ đen
    borderRadius: 10,
  },
  categoryContainer: {
    paddingHorizontal: 10,
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
    justifyContent: "space-between",
    //flexWrap: 'wrap', // Cho phép các card chuyển xuống dòng nếu không đủ chỗ
  },

  categoryCard: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
    marginHorizontal: 5,
    justifyContent: 'center', // Căn giữa nội dung theo trục dọc
    alignItems: 'center', // Căn giữa nội dung theo trục ngang
    borderRadius: 10,
  },
  categoryText: { fontSize: 16, color: "grey", fontWeight: "bold" },

});

export default ProductScreen;
