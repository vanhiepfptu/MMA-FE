import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Card from "../components/Card";
import { API_NEWS } from "../constants/api";
import { firebase } from "../constants/firebase.configs";
import Loading from "./../components/Loading";
const API_URL = API_NEWS;
const NewsScreen = ({ navigation }) => {
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
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add News</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity onPress={pickImage} style={styles.button}>
              <Text style={styles.buttonText}>Select Image</Text>
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
              <Text style={styles.buttonText}>Add news</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Text style={styles.title}>News List</Text>
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

export default NewsScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    backgroundColor: "#F5BD02",
  },
  buttonText: {
    fontSize: 14,
    color: "#AB2330",
    fontWeight: "bold",
    textAlign: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#AB2330",
    textAlign: "center",
    marginVertical: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "#FBE8A5",
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
    color: "#AB2330",
  },
  input: {
    width: "100%",
    backgroundColor: "#FFF",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 10,
    fontSize: 16,
    color: "#333",
    borderWidth: 0.5,
    borderColor: "#AB2330",
  },
  button: {
    backgroundColor: "#F5BD02",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 10,
    minWidth: "50%",
    elevation: 2,
    borderWidth: 1,
    borderColor: "#AB2330",
  },
});
