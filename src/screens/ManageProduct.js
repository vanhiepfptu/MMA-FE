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
  TouchableOpacity,
  View,
} from "react-native";
import { host } from "../constants/api";

function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [editableProduct, setEditableProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);

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
        `http://10.0.3.2:5000/api/products/${editableProduct.productid}`,
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

  // const deleteProduct = (productid) => {
  //   Alert.alert(
  //     "Delete Product",
  //     "Are you sure you want to delete this product?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       { text: "Delete", onPress: () => performDeleteProduct(productid) },
  //     ]
  //   );
  // };

  const deleteProduct = (productId) => {
    setDeleteProductId(productId);
    setIsModalVisible(!isModalVisible);
  };

  const performDeleteProduct = async (productId) => {
    try {
      const response = await fetch(
        `http://10.0.3.2:5000/api/products/${productId}`,
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
      setDeleteProductId(null);
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
        // onPress={() => deleteProduct(item.productid)}
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

      {/* <Modal
        visible={isEditModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.editModalContainer}>
          <Text style={styles.editModalTitle}>Edit Product</Text>

          <Text style={styles.editModalLabel}>Product Image</Text>
          <TextInput
            style={styles.editModalInput}
            value={editableProduct?.productImage.toString()}
            onChangeText={(text) =>
              setEditableProduct({ ...editableProduct, productImage: text })
            }
            placeholder="Imagelink"
          />

          <Text style={styles.editModalLabel}>Product Price</Text>
          <TextInput
            style={styles.editModalInput}
            value={editableProduct?.productPrice.toString()}
            onChangeText={(text) =>
              setEditableProduct({ ...editableProduct, productPrice: text })
            }
            placeholder="Product Price"
            keyboardType="numeric"
          />

          <Text style={styles.editModalLabel}>Product Type</Text>
          <TextInput
            style={styles.editModalInput}
            value={editableProduct?.productType}
            onChangeText={(text) =>
              setEditableProduct({ ...editableProduct, productType: text })
            }
            placeholder="Product Type"
          />

          <Text style={styles.editModalLabel}>Product Quantity</Text>
          <TextInput
            style={styles.editModalInput}
            value={editableProduct?.productQuantity.toString()}
            onChangeText={(text) =>
              setEditableProduct({ ...editableProduct, productQuantity: text })
            }
            placeholder="Product Quantity"
            keyboardType="numeric"
          />

          <View style={styles.editModalButtonContainer}>
            <Button
              title="Cancel"
              onPress={() => setEditModalVisible(false)}
              style={styles.editModalActionButton}
              color="#D04848"
            />
            <Button
              title="Save"
              onPress={handleEditSubmit}
              color="#4CAF50"
              style={styles.editModalActionButton}
            />
          </View>
        </View>
      </Modal> */}

      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => {
          setEditModalVisible(!isEditModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Product</Text>

            <Text style={styles.modalText}>Product Image</Text>
            <TextInput
              style={styles.editModalInput}
              value={editableProduct?.productImage.toString()}
              onChangeText={(text) =>
                setEditableProduct({ ...editableProduct, productImage: text })
              }
              placeholder="Image link"
            />

            <Text style={styles.modalText}>Product Price</Text>
            <TextInput
              style={styles.editModalInput}
              value={editableProduct?.productPrice.toString()}
              onChangeText={(text) =>
                setEditableProduct({ ...editableProduct, productPrice: text })
              }
              placeholder="Product Price"
              keyboardType="numeric"
            />

            <Text style={styles.modalText}>Product Type</Text>
            <TextInput
              style={styles.editModalInput}
              value={editableProduct?.productType}
              onChangeText={(text) =>
                setEditableProduct({ ...editableProduct, productType: text })
              }
              placeholder="Product Type"
            />

            <Text style={styles.modalText}>Product Quantity</Text>
            <TextInput
              style={styles.editModalInput}
              value={editableProduct?.productQuantity.toString()}
              onChangeText={(text) =>
                setEditableProduct({
                  ...editableProduct,
                  productQuantity: text,
                })
              }
              placeholder="Product Quantity"
              keyboardType="numeric"
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonUpdate]}
                onPress={handleEditSubmit}
              >
                <Text style={styles.textStyle}>Save</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* DELETE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              You want to delete this account?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  performDeleteProduct(deleteProductId);
                  setIsModalVisible(!isModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setIsModalVisible(!isModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  productContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#FBE8A5",
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderRadius: 20,
  },
  productPrice: {
    color: "#AB2330",
    marginRight: 30,
    marginLeft: 20,
    fontSize: 13,
    fontWeight: "300",
  },
  saveButton: {
    backgroundColor: "#4CAF50",
  },
  cancelButton: {
    backgroundColor: "#D04848",
  },
  saveButton_2: {
    minWidth: "50px",
  },
  productName: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "100%",
    marginTop: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 20,
    backgroundColor: "#FBE8A5",
    borderRadius: 20,
    padding: 20,
    borderWidth: 2,
    borderColor: "#F5BD02",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  input: {
    height: 40,
    borderColor: "#AB2330",
    borderWidth: 1,
    marginBottom: 20,
    borderRadius: 10,
    padding: 10,
    fontSize: 16,
    backgroundColor: "#FFFFFF",
    color: "#333",
    width: "100%",
  },
  label: {
    fontWeight: "bold",
    color: "#AB2330",
    marginTop: 10,
    marginBottom: 5,
    fontSize: 16,
  },
  big_title: {
    textAlign: "center",
    marginBottom: 20,
    fontSize: 22,
    fontWeight: "bold",
    color: "#AB2330",
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
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FBE8A5",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "#AB2330",
  },
  buttonCancel: {
    backgroundColor: "#F5BD02",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#AB2330",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FBE8A5",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#AB2330",
  },
  editModalInput: {
    height: 40,
    minWidth: "100%",
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#FBE8A5",
    borderColor: "#AB2330",
    borderRadius: 6,
    color: "#AB2330",
  },
  button: {
    backgroundColor: "#F5BD02",
    padding: 12,
    borderRadius: 20,
    elevation: 2,
    marginHorizontal: 5,
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  buttonCancel: {
    backgroundColor: "#D04848",
  },
  buttonUpdate: {
    backgroundColor: "#4CAF50",
  },
  modalTitle: {
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
    color: "#AB2330",
    fontSize: 30,
  },
});

export default ManageProduct;
