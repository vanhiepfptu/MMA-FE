import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { host } from "../constants/api";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editableProduct, setEditableProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5N2FlZDZjNTk3MDQyNjdmN2JmMzIiLCJpYXQiOjE3MTA4NDg3NDl9.MrbIEIMRLLubryoHZgvTBGhQeC0L79ZSgtz1iWgZaVo";

  useEffect(() => {
    fetchProducts();
  }, []);
  const fetchProducts = async () => {
    let allProducts = [];
    let page = 1;
    try {
      while (true) {
        const response = await fetch(
          `http://${host}:5000/api/products?page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const data = await response.json();
        if (response.ok && data.data.length > 0) {
          allProducts = allProducts.concat(data.data);
          if (page === data.totalPages) {
            break;
          }
          page++;
        } else {
          break;
        }
      }
      setProducts(allProducts);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const editProduct = (product) => {
    setEditableProduct(product);
    setEditModalVisible(true);
  };

  const handleEditSubmit = async () => {
    try {
      const dataToSubmit = {
        productImage: editableProduct.productImage,
        productPrice: editableProduct.productPrice,
        productQuantity: editableProduct.productQuantity,
        productType: editableProduct.productType,
      };

      const response = await fetch(
        `http://10.0.2.2:5000/api/products/${editableProduct.productid}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(dataToSubmit),
        }
      );

      if (response.ok) {
        alert("Product updated successfully");
        setEditModalVisible(false);
        fetchProducts(); // Refresh the products list
      } else {
        const errorData = await response.json();
        alert(`Failed to update product. Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = (productid) => {
    Alert.alert(
      "Delete Product",
      "Are you sure you want to delete this product?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", onPress: () => performDeleteProduct(productid) },
      ]
    );
  };
  const performDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://10.0.2.2:5000/api/products/${productId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        alert("Product deleted successfully");
        fetchProducts(); // Refresh the list after delete
      } else {
        alert("Failed to delete product. Status code: " + response.status);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productContainer}>
      <Image source={{ uri: item.productImage }} style={styles.productImage} />

      <Text style={styles.productName}>{item.productName}</Text>
      <Text style={styles.productPrice}>$ {item.productPrice}</Text>

      <Button title="Edit" onPress={() => editProduct(item)} />
      <Button
        title="Delete"
        onPress={() => deleteProduct(item.productid)}
        color="red"
      />
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.productid}
      />

      <Modal
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.big_title}>Edit Product</Text>

          <Text style={styles.label}>Product Image</Text>
          <TextInput
            style={styles.input}
            value={editableProduct?.productImage.toString()}
            onChangeText={(text) =>
              setEditableProduct({ ...editableProduct, productImage: text })
            }
            placeholder="Imagelink"
          />

          <Text style={styles.label}>Product Price</Text>
          <TextInput
            style={styles.input}
            value={editableProduct?.productPrice.toString()}
            onChangeText={(text) =>
              setEditableProduct({ ...editableProduct, productPrice: text })
            }
            placeholder="Product Price"
            keyboardType="numeric"
          />

          <Text style={styles.label}>Product Type</Text>
          <TextInput
            style={styles.input}
            value={editableProduct?.productType}
            onChangeText={(text) =>
              setEditableProduct({ ...editableProduct, productType: text })
            }
            placeholder="Product Type"
          />

          <Text style={styles.label}>Product Quantity</Text>
          <TextInput
            style={styles.input}
            value={editableProduct?.productQuantity.toString()}
            onChangeText={(text) =>
              setEditableProduct({ ...editableProduct, productQuantity: text })
            }
            placeholder="Product Quantity"
            keyboardType="numeric"
          />

          <View style={styles.buttonContainer}>
            <Button
              title="Cancel"
              onPress={() => setEditModalVisible(false)}
              style={styles.saveButton}
              color="#D04848"
            />
            <Button
              title="Save"
              onPress={handleEditSubmit}
              color="#4CAF50"
              style={styles.saveButton_2}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  // Add styles for input fields and modal container
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },
  productImage: {
    width: 50, // Điều chỉnh kích thước phù hợp
    height: 50, // Điều chỉnh kích thước phù hợp
    marginRight: 10, // Thêm khoảng cách giữa hình ảnh và tên sản phẩm
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 20,
  },

  productPrice: {
    color: "#FAA300",
    marginRight: 30,
    marginLeft: 20,
    fontSize: 13,
    fontWeight: "300",
  },

  saveButton: {
    marginRight: 20,
  },

  saveButton_2: {
    minWidth: "50px",
  },

  productName: {
    flex: 1,
  },
  buttonsContainer: {
    flexDirection: "row",
  },
  modalContainer: {
    marginTop: 200,
    marginHorizontal: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    color: "#7D7C7C",
  },
  label: {
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 5,
  },

  big_title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 20,
    fontWeight: "700",
    color: "#164863",
  },

  deleteButton: {
    borderRadius: 20,
  },

  button: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
  },
});

export default ManageProduct;
