import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { GET_ALL_QUOTAIOTIONS } from "../constants/api";

const QuotationList = ({ refreshKey }) => {
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
  }, [refreshKey]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Danh sách báo giá chuẩn</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <Text style={[styles.tableCell, styles.header]}>Tên Quotation</Text>
          <Text style={[styles.tableCell, styles.header]}>Giá</Text>
          <Text style={[styles.tableCell, styles.header]}>Mô tả</Text>
        </View>
        {quotations.map((quotation) => (
          <View key={quotation.quotationId.toString()} style={styles.tableRow}>
            <Text style={styles.tableCell}>{quotation.quotationName}</Text>
            <Text style={styles.tableCell}>${quotation.quotationPrice}</Text>
            <Text style={styles.tableCell}>
              {quotation.quotationDescription}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 20,
    color: "black",
    marginBottom: 10,
  },
  table: {
    flexDirection: "column",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#ddd",
    paddingBottom: 5,
    paddingTop: 5,
  },
  tableCell: {
    flex: 1,
  },
  header: {
    fontWeight: "bold",
  },
});

export default QuotationList;
