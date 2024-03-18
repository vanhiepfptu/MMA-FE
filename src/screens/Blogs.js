import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  Image,
  Alert,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { firebase } from "../constants/firebase.configs";
import { Geny } from "../constants/api";
const API_URL = `http://${Geny}:5000/api/blogs`;
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "./../components/Loading";
import Card from "../components/Card";
const Blogs = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  const [news, setNews] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newNewsTitle, setNewNewsTitle] = useState("");
  const [newNewsContent, setNewNewsContent] = useState("");
  const [newNewsAuthor, setNewNewsAuthor] = useState("");
  const [image, setImage] = useState(null);
  const token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU4Yjc3NWMzMWY1MGM5ZTNiZWM3NDMiLCJpYXQiOjE3MDk3NTAxMzN9.cQM3-hYgTDG_59_HvNkZQ7qeSZWrWHl1aLAC699A_2I";
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
    navigation.navigate("DetailBlog", { item });
  };
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => goToDetailScreen(item)}>
      <Card
        id={item.blogsid}
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
          blogsTitle: newNewsTitle,
          blogsContent: newNewsContent,
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
      <Text style={styles.title}>INTERIOR BLOGS</Text>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={(item) => item.blogsid.toString()}
          contentContainerStyle={styles.flatListContent}
        />
      )}
    </View>
  );
};

export default Blogs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#F5BD02",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#AB2330",
    textAlign: "center",
    marginVertical: 20,
  },
  flatListContent: {
    paddingHorizontal: 16,
  },
});
