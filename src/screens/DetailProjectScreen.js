import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
export default function DetailProjectScreen({ route }) {
  const navigation = useNavigation();
  const { item } = route.params;
  const goBack = () => {
    navigation.goBack();
  };

  return (
    <>
      <View className="flex items-center justify-center mt-6">
        {/* <Image
        source={{ uri: item?.images[0] }}
        className="w-64 h-64 mb-8 rounded-2xl"
        style={{ resizeMode: "contain" }}
      /> */}
        <Text className="text-2xl font-bold mb-4">{item?.projectTitle}</Text>
        <Text className="text-lg mb-6">{item?.projectDescription}</Text>
        <Text className="text-lg">client: {item.client.username}</Text>
        <Text className="text-lg">
          startDate: {moment(item.startDate).format("DD/MM/YYYY")}
        </Text>
        <Text className="text-lg">
          endDate: {moment(item.endDate).format("DD/MM/YYYY")}
        </Text>
      </View>
      <Text className="text-2xl font-bold mt-2 ml-2">Quotation</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Name</Text>
          <Text style={styles.cell}>Des</Text>
          <Text style={styles.cell}>Category</Text>
          <Text style={styles.cell}>Price</Text>
        </View>
        {item.quotation.map((item) => (
          <View style={styles.row}>
            <Text style={styles.cell}>{item.quotationName}</Text>
            <Text style={styles.cell}>{item.quotationDescription}</Text>
            <Text style={styles.cell}>{item.quotationCategory}</Text>
            <Text style={styles.cell}>{item.quotationPrice}</Text>
          </View>
        ))}
      </View>
    </>
  );
}
const styles = StyleSheet.create({
  table: {
    borderWidth: 1,
    borderColor: "#000",
    margin: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#000",
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
  },
});