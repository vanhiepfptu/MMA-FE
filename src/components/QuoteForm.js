import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { GET_ALL_QUOTAIOTIONS } from "../constants/api";

const QuotationForm = ({ onSubmit }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [quotations, setQuotations] = useState([]);
  const url = GET_ALL_QUOTAIOTIONS;

  const getData = async () => {
    try {
      const response = await fetch(url);
      const json = await response.json();
      if (json) {
        setQuotations(json.data);
        console.log(json.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Giả sử đây là dữ liệu lấy từ API của bạn
  const items = [
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
  ];

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = () => {
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email");
      return;
    }
    setError("");
    // Gửi dữ liệu
    console.log({
      selectedItems,
      email,
    });
    onSubmit({ selectedItems, email });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>HÃY ĐỂ LẠI THÔNG TIN MÀ BẠN QUAN TÂM</Text>
        {quotations.map((item) => (
          <TouchableOpacity
            key={item.quotationName}
            style={styles.checkboxContainer}
            onPress={() => handleSelectItem(item.id)}
          >
            <Text style={styles.checkboxLabel}>{item.quotationName}</Text>
            <Text>{selectedItems.includes(item.id) ? "✓" : ""}</Text>
          </TouchableOpacity>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <Button title="Gửi form" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f8f8f8",
    color: "#444",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: "5px",
    boxShadow: "0 0 5px rgba(#124, 0)",
    overflow: "hidden",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
  },
  checkboxLabel: {
    marginRight: 8,
  },
  error: {
    color: "red",
  },
  title: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 10,
    fontFamily: "Montserrat",
    
   },
  // form: {
  //   margin: 10,
  //   backgroundColor: "#BCFBF9",
  //   padding: 16,
  // },
});

export default QuotationForm;
