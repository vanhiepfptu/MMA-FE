// UserScreen.js
import React, { useState, useEffect } from "react";
import { View, FlatList, Button, StyleSheet } from "react-native";
import QuoteForm from "../components/QuoteForm.js"; // Được giả định đã tạo
import QuoteList from "../components/QuoteList.js"; // Được giả định đã tạo

const UserScreen = () => {
  // Trạng thái để lưu trữ danh sách báo giá từ API
  const [quotes, setQuotes] = useState([]);

  useEffect(() => {
    // Lấy dữ liệu báo giá từ API khi màn hình được tải
  }, []);

  // Hàm để gửi báo giá đã chọn về phía nhân viên
  const handleSubmit = (selectedQuotes) => {
    // Gửi thông tin đã chọn thông qua API
  };

  return (
    <View style={styles.container}>
      <View style={styles.subContainer}>
        <QuoteList />
      </View>
      <View style={styles.subContainer}>
        <QuoteForm onSubmit={handleSubmit} />
      </View>
    </View>
  );
};

export default UserScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBE8A5",
  },
  subContainer: {
    flex: 2,
    padding: 10,
    margin: 5,
  },
});
