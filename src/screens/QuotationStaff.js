import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import QuotationList from "../components/QuoteList";
import { backend_host } from "../constants/api";

const QuotationStaffScreen = ({ onAddSuccess }) => {
  const [quotationName, setQuotationName] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [quotationDescription, setQuotationDescription] = useState("");
  const [quotationCategory, setQuotationCategory] = useState("");
  const [quotationPrice, setQuotationPrice] = useState("");
  const [quotationManagedBy, setQuotationManagedBy] = useState("");
  const id = "65f488762cf368dbcea22c17";
  const admin_token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5ODA1YTBkYzc5MDgzZjFhYmJkYTciLCJpYXQiOjE3MTA4NTAxMzh9.y8158XhPNg3jDPAZKpS8sw7k8fEBAy-fUQTnmXHR4-E";
  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };
  const handleSubmit = async () => {
    const quotationData = {
      quotationName,
      quotationDescription,
      quotationCategory,
      quotationPrice: parseInt(quotationPrice, 10),
      quotationManagedBy: id,
    };
    try {
      const response = await fetch(
        `http://${backend_host}:5000/api/standard-quotations/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${admin_token}`,
          },
          body: JSON.stringify(quotationData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add quotation");
      }

      const result = await response.json();
      console.log(result);
      alert("Quotation added successfully!");
      handleRefresh();
      //   onAddSuccess();
    } catch (error) {
      console.error(error);
      alert("Error adding quotation");
    }
  };

  return (
    <View style={styles.formContainer}>
      <QuotationList refreshKey={refreshKey}></QuotationList>
      <View style={styles.card}>
        <Text style={styles.title}>THÊM QUOTATION CƠ BẢN</Text>
        <TextInput
          style={styles.input}
          placeholder="Quotation Name"
          value={quotationName}
          onChangeText={setQuotationName}
        />
        <TextInput
          style={styles.input}
          placeholder="Description"
          value={quotationDescription}
          onChangeText={setQuotationDescription}
        />
        <TextInput
          style={styles.input}
          placeholder="Category"
          value={quotationCategory}
          onChangeText={setQuotationCategory}
        />
        <TextInput
          style={styles.input}
          placeholder="Price"
          value={quotationPrice}
          onChangeText={setQuotationPrice}
          keyboardType="numeric"
        />
        {/* <TextInput
          style={styles.input}
          placeholder="Managed By (User ID)"
          value={quotationManagedBy}
          onChangeText={setQuotationManagedBy}
        /> */}
        <Button color="#F5BD02" title="Add Quotation" onPress={handleSubmit} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  formContainer: {
    padding: 20,
    flex: 1,
    backgroundColor: "#FBE8A5",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  card: {
    backgroundColor: "#FBE8A5",
    // borderRadius: "5",
    boxShadow: "0 0 5 rgba(#124, 0)",
    overflow: "hidden",
  },
  title: {
    fontSize: 14,
    color: "black",
    fontWeight: "bold",
    marginHorizontal: 16,
    marginBottom: 10,
    marginVertical: 10,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    marginHorizontal: 10,
  },
});

export default QuotationStaffScreen;
