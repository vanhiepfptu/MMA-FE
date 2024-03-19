import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Card from "../components/Card";
import { API_NEWS } from "../constants/api";
import { firebase } from "../constants/firebase.configs";
import Loading from "./../components/Loading";
const API_URL = API_NEWS;
const News = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  const [news, setNews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsContent, setNewNewsContent] = useState("");
  const [newNewsAuthor, setNewNewsAuthor] = useState("");
  const [image, setImage] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5N2FlZDZjNTk3MDQyNjdmN2JmMzIiLCJpYXQiOjE3MTA4NDg3NDl9.MrbIEIMRLLubryoHZgvTBGhQeC0L79ZSgtz1iWgZaVo";
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setNews(response.data.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching news:", error);
    }
  };

  const deleteNews = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, config);
      fetchNews();
    } catch (error) {
      console.error("Error deleting news:", error);
      Alert.alert("Failed to delete news. Please try again.");
    }
  };
  const goToDetailScreen = (item) => {
    navigation.navigate("DetailNew", { item });
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToDetailScreen(item)}>
      <Card
        id={item.newsid}
        images={item.images[0]}
        author={item.author}
        publishDate={item.publishDate}
        deleteNews={deleteNews}
      />
    </TouchableOpacity>
  );
  const addNews = async () => {
    try {
      if (!newNewsTitle || !newNewsContent || !newNewsAuthor || !image) {
        Alert.alert("Please fill in all fields.");
        return;
      }

      await axios.post(
        API_URL,
        {
          newsTitle: newNewsTitle,
          newsContent: newNewsContent,
          author: newNewsAuthor,
          images: image,
        },
        config
      );
      setNewNewsTitle("");
      setNewNewsContent("");
      setNewNewsAuthor("");
      setImage(null);
      fetchNews();
      setModalVisible(false);
    } catch (error) {
      console.error("Error adding news:", error);
      Alert.alert("Failed to add news. Please try again.");
    }
  };

  const pickImage = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (permissionResult.granted === false) {
        Alert.alert("Permission to access camera roll is required!");
        return;
      }

      let pickerResult = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!pickerResult.canceled) {
        const response = await fetch(pickerResult.assets[0].uri);
        const blob = await response.blob();
        const filename = pickerResult.assets[0].uri.substring(
          pickerResult.assets[0].uri
        );
        const ref = firebase.storage().ref().child(filename);
        const snapshot = await ref.put(blob);
        const url = await snapshot.ref.getDownloadURL();
        setImage(url);
      }
    } catch (error) {
      console.error("Error picking image:", error);
      Alert.alert("Failed to pick image. Please try again.");
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>INTERIOR DESIGN NEWS</Text>
      <View className="mb-2" />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={(item) => item.newsid.toString()}
          className="px-4"
        />
      )}
    </View>
  );
};

export default News;

const styles = StyleSheet.create({
  container: {
    marginTop: "top",
    justifyContent: "center",
    backgroundColor: "#F5BD02",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#AB2330",
    textAlign: "center",
  },
});
