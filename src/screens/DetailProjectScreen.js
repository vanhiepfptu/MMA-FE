import React, { useState, useEffect } from "react";
import {
  View,
  Image,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
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
    <ScrollView style={styles.container}>
      {item &&
        Array.isArray(item.projectImages) &&
        item.projectImages.length > 0 && (
          <Image source={{ uri: item.projectImages[0] }} style={styles.image} />
        )}
      <Text style={styles.title}>{item?.projectTitle}</Text>
      <Text style={styles.description}>{item?.projectDescription}</Text>
      {/* <Text style={styles.clientInfo}>client: {item.client?.username}</Text> */}
      <Text style={styles.dateText}>
        startDate: {moment(item.startDate).format("DD/MM/YYYY")}
      </Text>
      <Text style={styles.dateText}>
        endDate: {moment(item.endDate).format("DD/MM/YYYY")}
      </Text>
      <Text style={styles.quotationHeader}>Quotation</Text>
      <View style={styles.table}>
        <View style={styles.row}>
          <Text style={styles.cell}>Name</Text>
          <Text style={styles.cell}>Description</Text>
          <Text style={styles.cell}>Category</Text>
          <Text style={styles.cell}>Price</Text>
        </View>
        {item.quotation &&
          item.quotation.map((qItem, index) => (
            <View key={index} style={styles.row}>
              <Text style={styles.cell}>{qItem.quotationName}</Text>
              <Text style={styles.cell}>{qItem.quotationDescription}</Text>
              <Text style={styles.cell}>{qItem.quotationCategory}</Text>
              <Text style={styles.cell}>{qItem.quotationPrice}</Text>
            </View>
          ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#FBE8A5",
  },
  image: {
    width: "100%",
    height: 256,
    borderRadius: 20,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#AB2330",
    textAlign: "center",
  },
  description: {
    fontSize: 18,
    marginBottom: 12,
    color: "#333",
    textAlign: "center",
  },
  clientInfo: {
    fontSize: 18,
    color: "#333",
  },
  dateText: {
    fontSize: 18,
    color: "#333",
  },
  quotationHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
    color: "#AB2330",
  },
  table: {
    borderWidth: 1,
    borderColor: "#AB2330",
    margin: 10,
    borderRadius: 10,
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#AB2330",
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    color: "#333",
    fontSize: 16,
  },
});
