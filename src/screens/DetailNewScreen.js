import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Loading from "../components/Loading";
import { API_NEWS } from "../constants/api";
const API_URL = API_NEWS;
export default function DetailNewScreen({ route }) {
  const navigation = useNavigation();
  const { item } = route.params;
  const [news, setNews] = useState(false);
  const [loading, setLoading] = useState(false);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU4Yjc3NWMzMWY1MGM5ZTNiZWM3NDMiLCJpYXQiOjE3MDk3NTAxMzN9.cQM3-hYgTDG_59_HvNkZQ7qeSZWrWHl1aLAC699A_2I";
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
  }, [item.newsid]);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${item.newsid}`, config);
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
              <Text style={styles.title}>{news?.title}</Text>
              <Text style={styles.content}>{news?.content}</Text>
              <Text style={styles.author}>Author: {news?.author}</Text>
              <Text style={styles.publishDate}>
                Publish Date: {moment(news?.publishDate).format("DD/MM/YYYY")}
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
    backgroundColor: "#FFF",
  },
  container: {
    alignItems: "flex-start",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    resizeMode: "cover",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  content: {
    fontSize: 16,
    marginBottom: 10,
    textAlign: "justify",
  },
  author: {
    fontSize: 16,
    marginBottom: 5,
  },
  publishDate: {
    fontSize: 16,
  },
});
