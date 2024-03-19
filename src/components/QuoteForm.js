import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GET_ALL_QUOTAIOTIONS, backend_host } from "../constants/api";
// import { ScrollView } from "react-native-web";

const QuotationForm = ({ onSubmit }) => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [userToken, setUserToken] = useState("");
  const ADMIN_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5ODA1YTBkYzc5MDgzZjFhYmJkYTciLCJpYXQiOjE3MTA4NTAxMzh9.y8158XhPNg3jDPAZKpS8sw7k8fEBAy-fUQTnmXHR4-E";
  const STAFF_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5N2FlZDZjNTk3MDQyNjdmN2JmMzIiLCJpYXQiOjE3MTA4NDg3NDl9.MrbIEIMRLLubryoHZgvTBGhQeC0L79ZSgtz1iWgZaVo";
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

  const postQuotationData = async (data) => {
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY0ODg3NjJjZjM2OGRiY2VhMjJjMTciLCJpYXQiOjE3MTA1MjQ1MzR9.lqlRkPu-XQ55taKNmZ9v0RIHqFjDuduPV5ty3G7A-Xo";
    try {
      const response = await fetch(
        `http://${backend_host}:5000/api/standard-quotations/calculate-quotation`,
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
    // <View style={styles.container}>
    //   <View style={styles.card}>
    //     <Text style={styles.title}>
    //       HÃY ĐỂ LẠI THÔNG TIN BÁO GIÁ MÀ BẠN QUAN TÂM
    //     </Text>
    //     {quotations.map((item) => (
    //       <TouchableOpacity
    //         key={item.quotationName}
    //         style={styles.checkboxContainer}
    //         onPress={() => handleSelectItem(item.quotationId)}
    //       >
    //         <Text style={styles.checkboxLabel}>{item.quotationName}</Text>
    //         <Text>Giá: {item.quotationPrice} </Text>
    //         <Text>{selectedItems.includes(item.quotationId) ? " ✓" : ""}</Text>
    //       </TouchableOpacity>
    //     ))}
    //     <TextInput
    //       style={styles.input}
    //       placeholder="Enter your email"
    //       value={email}
    //       onChangeText={setEmail}
    //     />
    //     {error ? <Text style={styles.error}>{error}</Text> : null}
    //     <Button title="Gửi form" onPress={handleSubmit} />
    //     {notifications ? (
    //       <Text style={styles.notification}>{notifications}</Text>
    //     ) : null}
    //   </View>
    // </View>
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>
          HÃY ĐỂ LẠI THÔNG TIN BÁO GIÁ MÀ BẠN QUAN TÂM
        </Text>
        {quotations.map((item) => (
          <View key={item.quotationId} style={styles.row}>
            <TouchableOpacity
              key={item.quotationName}
              style={styles.checkboxContainer}
              onPress={() => handleSelectItem(item.quotationId)}
            >
              <Text style={styles.cell}>
                {`${item.quotationName} - $${item.quotationPrice}`}{" "}
                {selectedItems.includes(item.quotationId) ? "✓" : ""}
              </Text>
              {/* <Checkbox
              value={selectedItems.includes(item.quotationId)}
              onPress={() => handleSelectItem(item.quotationId)}
            /> */}
              {/* <Text>
                {selectedItems.includes(item.quotationId) ? " ✓" : ""}
              </Text> */}
            </TouchableOpacity>
          </View>
        ))}
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          value={email}
          onChangeText={setEmail}
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        {/* <Button
          sytle={styles.inputForm}
          title="Gửi form"
          onPress={handleSubmit}
        /> */}
        <TouchableOpacity onPress={handleSubmit} style={styles.inputFormButton}>
          <Text style={styles.inputFormButtonText}>Gửi form</Text>
        </TouchableOpacity>
        {notifications ? (
          <Text style={styles.notification}>{notifications}</Text>
        ) : null}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    padding: 20,
    backgroundColor: "#F5BD02",
  },
  row: {
    flexDirection: "row",
    // justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  cell: {
    flex: 1,
  },
  choosen: {
    backgroundColor: "green",
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 20,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  error: {
    color: "red",
  },
  title: {
    fontSize: 16,
    color: "black",
    fontWeight: "bold",
    marginBottom: 10,
  },
  notification: {
    color: "#FF0000",
    marginVertical: 10,
    justifyContent: "center",
    marginHorizontal: 10,
    alignItems: "center",
  },
  inputFormButton: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    marginVertical: 10,
  },
  inputFormButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default QuotationForm;
