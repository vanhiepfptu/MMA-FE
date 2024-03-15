import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { GET_ALL_QUOTAIOTIONS } from "../constants/api";

const QuotationList = ({ refreshKey }) => {
  // Thêm prop refreshKey
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
  }, [refreshKey]); // Sử dụng refreshKey làm một phần của dependencies

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Danh sách báo giá chuẩn</Text>
      <FlatList
        data={quotations}
        keyExtractor={(item) => item.quotationId.toString()}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.quote}>{item.quotationName}</Text>
            <Text style={styles.price}>Giá: ${item.quotationPrice}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  item: {
    backgroundColor: "lightgray",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  quote: {
    fontSize: 14,
  },
  price: {
    fontSize: 12,
    color: "darkslateblue",
  },
  title: {
    fontSize: 20,
    color: "black",
    marginHorizontal: 16,
  },
});

export default QuotationList;
