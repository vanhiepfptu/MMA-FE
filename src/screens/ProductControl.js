import React, { useEffect, useState } from "react";
import { Text, View, TextInput, Button, StyleSheet } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TouchableOpacity } from "react-native";
import { host } from "../constants/api";

function ProductControl() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productImage, setProductImage] = useState("");
  const [productSize, setProductSize] = useState("");
  const [productType, setProductType] = useState("");
  const [dateImport, setDateImport] = useState("");
  const [productQuantity, setProductQuantity] = useState("");
  const [productMaterial, setProductMaterial] = useState("");
  const [productDescription, setProductDescription] = useState("");

  useEffect(() => {
    const today = new Date();
    const dateString = today.toISOString().split("T")[0];
    setDateImport(dateString);
  }, []);

  const handlePriceChange = (text) => {
    if (!isNaN(text)) {
      setProductPrice(text);
    }
  };

  const handleQuantityChange = (text) => {
    const num = parseInt(text, 10);
    if (!isNaN(num) && num >= 0 && num % 2 === 0) {
      setProductQuantity(text);
    }
  };
  const handleSubmit = async () => {
    const productData = {
      productName,
      productPrice: parseFloat(productPrice),
      productImage,
      productSize,
      productType,
      dateImport,
      productQuantity: parseInt(productQuantity),
      productMaterial,
      productDescription,
    };

    try {
      const response = await fetch(`http://${host}:5000/api/products/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5ODA1YTBkYzc5MDgzZjFhYmJkYTciLCJpYXQiOjE3MTA4NTAxMzh9.y8158XhPNg3jDPAZKpS8sw7k8fEBAy-fUQTnmXHR4-E`, // Token xác thực của bạn
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        // Xử lý kết quả nếu cần, ví dụ hiển thị thông báo hoặc làm mới danh sách sản phẩm
        alert("Product added successfully!");
      } else {
        alert("Failed to add product. Status code: " + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.big_title}>Import New Product</Text>
      <TextInput
        placeholder="Product Name"
        value={productName}
        onChangeText={setProductName}
        style={styles.input}
      />
      <TextInput
        placeholder="Product Price"
        value={productPrice}
        onChangeText={handlePriceChange}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Imagelink"
        value={productImage}
        onChangeText={setProductImage}
        style={styles.input}
      />
      <TextInput
        placeholder="Product Size"
        value={productSize}
        onChangeText={setProductSize}
        style={styles.input}
      />

      <TextInput
        placeholder="Product Quantity"
        value={productQuantity}
        onChangeText={handleQuantityChange}
        style={styles.input}
        keyboardType="numeric"
      />
      <TextInput
        placeholder="Product Material"
        value={productMaterial}
        onChangeText={setProductMaterial}
        style={styles.input}
      />
      <TextInput
        placeholder="Product Description"
        value={productDescription}
        onChangeText={setProductDescription}
        style={styles.input}
        multiline
      />

      <Picker
        selectedValue={productType}
        onValueChange={(itemValue, itemIndex) => setProductType(itemValue)}
        style={styles.picker}
      >
        <Picker.Item label="Light" value="Light" />
        <Picker.Item label="Sofa" value="Sofa" />
        <Picker.Item label="Table" value="Table" />
        <Picker.Item label="Chair" value="Chair" />
      </Picker>
      <Text>Date Import: {dateImport}</Text>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginTop: 80,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginVertical: 5,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 15,
  },
  picker: {
    height: 10,
    width: "30%",
  },

  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  big_title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#164863",
  },
});

export default ProductControl;
