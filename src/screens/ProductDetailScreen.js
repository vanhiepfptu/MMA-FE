import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
} from "react-native";
// import { Card } from 'react-native-elements';
// import { Button } from 'react-native-paper';
import { Picker } from "@react-native-picker/picker";
import { host } from "../constants/api";
const ProductDetailScreen = ({ route }) => {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState("default");

  useEffect(() => {
    const fetchProductDetail = async () => {
      try {
        const response = await fetch(
          `http://${host}:5000/api/products/${productId}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
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
            {/* <Text style={styles.price}>${product.productPrice}</Text> */}
          </View>
          <View style={styles.headerContainer}>
            <Text style={styles.price}>${product.productPrice}</Text>
          </View>
          <Text style={styles.review}>★ 4.5 (20 Review)</Text>
          <View style={styles.descriptionContainer}>
            <Text style={styles.detail}>Details</Text>
            <Text style={styles.description}>{product.productDescription}</Text>
            <Text style={styles.description}>
              Material:{" "}
              <Text style={styles.boldText}>{product.productMaterial}</Text>
            </Text>
            <Text style={styles.description}>
              Category:{" "}
              <Text style={styles.boldText}>{product.productType}</Text>
            </Text>
            <Text style={styles.description}>
              In-stock:{" "}
              <Text style={styles.boldText}>{product.productQuantity}</Text>
            </Text>
          </View>
          <View style={styles.sizeContainer}>
            <Text style={styles.size}>Size</Text>
            <Picker
              style={styles.picker}
              selectedValue={selectedSize}
              onValueChange={(itemValue, itemIndex) =>
                setSelectedSize(itemValue)
              }
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
    padding: 20,
    backgroundColor: "#FBE8A5",
  },
  boldText: {
    fontWeight: "bold",
    color: "#333333",
  },
  sizeContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#F5BD02",
    borderRadius: 10,
  },
  size: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
  },
  image: {
    width: "100%",
    height: 300,
    resizeMode: "cover",
    borderRadius: 15,
    marginBottom: 20,
  },
  detail: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333333",
    marginBottom: 10,
  },
  picker: {
    height: 50,
    width: "100%",
    marginTop: 10,
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 10,
  },
  descriptionContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#F5BD02",
    borderRadius: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333333",
  },
  review: {
    fontSize: 16,
    color: "#FFA500",
    marginVertical: 10,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#E63946",
  },
  description: {
    fontSize: 16,
    color: "#333333",
    lineHeight: 24,
    marginBottom: 5,
  },
});

export default ProductDetailScreen;
