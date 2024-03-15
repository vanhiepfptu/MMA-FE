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
import AsyncStorage from "@react-native-async-storage/async-storage";

const QuotationForm = ({ onSubmit }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [userToken, setUserToken] = useState("");
  const ADMIN_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU4NjFlOTJiNWVlYTI4NTU2NDJiM2IiLCJpYXQiOjE3MDk3MjgyMzN9.PlJnL2HO8BExwcleE-aZP5L5c45njL0RDk1jKmaYyXg";
  const STAFF_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU4Yjc3NWMzMWY1MGM5ZTNiZWM3NDMiLCJpYXQiOjE3MDk3NTAxMzN9.cQM3-hYgTDG_59_HvNkZQ7qeSZWrWHl1aLAC699A_2I";
  // const token =
  //   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY0ODg3NjJjZjM2OGRiY2VhMjJjMTciLCJpYXQiOjE3MTA1MjQ1MzR9.lqlRkPu-XQ55taKNmZ9v0RIHqFjDuduPV5ty3G7A-Xo";

  const [quotations, setQuotations] = useState([]);
  const url = GET_ALL_QUOTAIOTIONS;
  const [notifications, setNotifications] = useState("");
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
  const getToken = async () => {
    const data = await AsyncStorage.getItem("Account");
    return data?.account.tokens[0];
  };
  useEffect(() => {
    getData();
  }, []);

  // Giả sử đây là dữ liệu lấy từ API của bạn
  // const items = [
  //   { id: 1, name: "Item 1" },
  //   { id: 2, name: "Item 2" },
  //   { id: 3, name: "Item 3" },
  // ];
  const postQuotationData = async (data) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY0ODg3NjJjZjM2OGRiY2VhMjJjMTciLCJpYXQiOjE3MTA1MjQ1MzR9.lqlRkPu-XQ55taKNmZ9v0RIHqFjDuduPV5ty3G7A-Xo";
    try {
      const response = await fetch(
        "http://192.168.56.1:5000/api/standard-quotations/calculate-quotation",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            quotationIds: data.selectedItems,
            email: data.email,
          }),
        }
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const jsonResponse = await response.json();
      console.log(jsonResponse);
      // Thêm dòng này để thông báo gửi thành công
      console.log("Data has been successfully sent!");
      setNotifications(`Đã gửi thông tin cho đến ${data.email}`);
      // Xử lý dữ liệu trả về ở đây, ví dụ hiển thị thông báo thành công, v.v.
    } catch (error) {
      console.error("There was an error!", error);
      // Xử lý lỗi ở đây, ví dụ hiển thị thông báo lỗi
    }
  };

  const handleSelectItem = (id) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSubmit = async () => {
    // Validate email
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Invalid email");
      return;
    }
    setError("");

    // Gửi dữ liệu
    const formData = {
      selectedItems,
      email,
    };

    console.log(formData);

    await postQuotationData(formData); // Gọi function để post data

    // Gọi onSubmit sau khi đã post data thành công, nếu cần
    onSubmit(formData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          HÃY ĐỂ LẠI THÔNG TIN BÁO GIÁ MÀ BẠN QUAN TÂM
        </Text>
        {quotations.map((item) => (
          <TouchableOpacity
            key={item.quotationName}
            style={styles.checkboxContainer}
            onPress={() => handleSelectItem(item.quotationId)}
          >
            <Text style={styles.checkboxLabel}>{item.quotationName}</Text>
            <Text>Giá: {item.quotationPrice} </Text>
            <Text>{selectedItems.includes(item.quotationId) ? " ✓" : ""}</Text>
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
        {notifications ? (
          <Text style={styles.notification}>{notifications}</Text>
        ) : null}
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
    // borderRadius: "5",
    boxShadow: "0 0 5 rgba(#124, 0)",
    overflow: "hidden",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    marginHorizontal: 10,
  },
  checkboxContainer: {
    flexDirection: "row",
    marginBottom: 20,
    alignItems: "center",
    marginHorizontal: 10,
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
    marginVertical: 10,
    // fontFamily: "Montserrat",
  },
  // form: {
  //   margin: 10,
  //   backgroundColor: "#BCFBF9",
  //   padding: 16,
  // },
  notification: {
    color: "#FF0000",
    marginVertical: 10,
    justifyContent: "center",
    marginHorizontal: 10,
    alignItems: "center",
  },
});

export default QuotationForm;
