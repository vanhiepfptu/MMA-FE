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
import { Geny, Android } from "../constants/api";
const API_URL = `http://${Android}:5000/api/blogs`;
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "./../components/Loading";
import Card from "../components/Card";
const BlogScreen = ({ navigation }) => {
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
    <View className="flex-1" style={{ marginTop: top }}>
      <Button title="Add Blogs" onPress={() => setModalVisible(true)} />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
              <Text>Select Image</Text>
            </TouchableOpacity>
            {/* <Button title="Select Image" onPress={pickImage} style={styles.button} /> */}
            {image && (
              <Image
                source={{ uri: image }}
                style={{ width: 200, height: 200 }}
              />
            )}
            <TextInput
              style={styles.input}
              placeholder="Title"
              value={newNewsTitle}
              onChangeText={setNewNewsTitle}
            />
            <TextInput
              style={styles.input}
              placeholder="Content"
              value={newNewsContent}
              onChangeText={setNewNewsContent}
            />
            <TextInput
              style={styles.input}
              placeholder="Author"
              value={newNewsAuthor}
              onChangeText={setNewNewsAuthor}
            />
            <TouchableOpacity onPress={addNews} style={styles.button}>
              <Text>Add news</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.button}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text>Blogs List</Text>
      <View className="mb-2" />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={news}
          renderItem={renderItem}
          keyExtractor={(item) => item.blogsid.toString()}
          className="px-4"
        />
      )}
    </View>
  );
};

export default BlogScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    width: "100%",
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  button: {
    backgroundColor: "#91caff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 4,
    marginBottom: 10,
  },
});
