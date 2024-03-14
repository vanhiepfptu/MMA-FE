import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Card } from 'react-native-elements';
import { Button } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('default');

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(`http://10.0.3.2:5000/api/products/${productId}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);


      } catch (error) {
        console.error('Failed to fetch product details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetail();
  }, [productId]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.container}>
      {product && (
        <>
          <Image source={{ uri: product.productImage }} style={styles.image} />
          <View style={styles.headerContainer}>
            <Text style={styles.name}>{product.productName}</Text>
            <Text style={styles.price}>${product.productPrice}</Text>
          </View>
          <Text style={styles.review}>★ 4.5 (20 Review)</Text>

          <View style={styles.descriptionContainer}>

            <Text style={styles.detail}>Details</Text>
            <Text style={styles.description}>{product.productDescription}</Text>
            <Text style={styles.description}>
              Material: <Text style={styles.boldText}>{product.productMaterial}</Text>
            </Text>
            <Text style={styles.description}>
              Category: <Text style={styles.boldText}>{product.productType}</Text>
            </Text>

            <Text style={styles.description}>
              In-stock: <Text style={styles.boldText}>{product.productQuantity}</Text>
            </Text>

          </View>
          <View style={styles.sizeContainer}>
            <Text style={styles.size}>Size</Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedSize}
              onValueChange={(itemValue, itemIndex) => setSelectedSize(itemValue)}
            >
              <Picker.Item label="Size" value="default" />
              <Picker.Item label={product.productSize} value="unique" />

            </Picker>
          </View>


        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  boldText: {
    fontWeight: 'bold',
  },
  sizeContainer: {
    marginTop: 10,
  },

  size: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  image: {
    width: '100%',
    height: 300,
  },
  detail: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: 150,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginVertical: 5,
    flexWrap: 'wrap', // Cho phép các item bên trong container này xuống dòng nếu không đủ không gian
  },

  descriptionContainer: {
    marginTop: 10,
  },

  name: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1, // Cho phép chiếm đến một nửa không gian container nếu cần
    flexWrap: 'wrap', // Cho phép text xuống dòng nếu không đủ không gian
    marginRight: 10, // Thêm một chút khoảng cách giữa productName và productPrice
  },
  review: {
    fontSize: 15,
    color: '#FF6600', // Màu vàng cho sao
    marginVertical: 0,
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF6600',
    alignSelf: 'flex-start', // Cho phép chiếm đến một nửa không gian container
  },
  description: {
    fontSize: 16,
  },
  // Thêm các styles cho các chi tiết khác của sản phẩm
});

export default ProductDetailScreen;
