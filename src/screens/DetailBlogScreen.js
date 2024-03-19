import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import Loading from "../components/Loading";
import { API_BLOG } from "../constants/api";
const API_URL = API_BLOG;
export default function DetailBlogScreen({ route }) {
  const navigation = useNavigation();
  const { item } = route.params;
  const [news, setNews] = useState(false);
  const [loading, setLoading] = useState(false);

  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5N2FlZDZjNTk3MDQyNjdmN2JmMzIiLCJpYXQiOjE3MTA4NDg3NDl9.MrbIEIMRLLubryoHZgvTBGhQeC0L79ZSgtz1iWgZaVo";

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const goBack = () => {
    navigation.goBack();
  };

  useEffect(() => {
    fetchNews();
  }, [item.blogsid]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${item.blogsid}`, config);
      setNews(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching news:", error);
    }
  };

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        news && (
          <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
              <Image source={{ uri: news?.images[0] }} style={styles.image} />
              <Text style={styles.title}>{news?.blogsTitle}</Text>
              <Text style={styles.content}>{news?.blogsContent}</Text>
              <Text style={styles.detail}>Author : {news?.author}</Text>
              <Text style={styles.detail}>
                Publish Date : {moment(news?.publishDate).format("DD/MM/YYYY")}
              </Text>
            </View>
          </ScrollView>
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
    backgroundColor: "#FBE8A5",
  },
  container: {
    alignItems: "flex-start",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
    borderRadius: 20,
    resizeMode: "cover",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "justify",
  },
  detail: {
    fontSize: 16, // Kích thước font cho thông tin tác giả và ngày xuất bản
    marginBottom: 5, // Khoảng cách giữa các thông tin chi tiết
  },
});
