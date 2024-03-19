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
import axios from "axios";
import { API_PROJECT } from "../constants/api";
const API_URL = API_PROJECT;
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Loading from "./../components/Loading";
import moment from "moment";
const ProjectScreen = ({ navigation }) => {
  const { top } = useSafeAreaInsets();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      const filter = response.data.filter((e) => e.status === "completed");
      setProjects(filter);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching news:", error);
    }
  };

  const goToDetailScreen = (item) => {
    navigation.navigate("DetailProject", { item });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => goToDetailScreen(item)}
      style={styles.projectItem}
    >
      <View style={styles.projectCard}>
        <View>
          <Text style={styles.projectTitle}>{item.projectTitle}</Text>
          <Text style={styles.projectDate}>
            start: {moment(item.startDate).format("DD/MM/YYYY")}
          </Text>
          <Text style={styles.projectDate}>
            end: {moment(item.endDate).format("DD/MM/YYYY")}
          </Text>
          <Text style={styles.projectClient}>
            client: {item.client?.username}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { marginTop: top }]}>
      <Text style={styles.title}>Project List</Text>
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={projects}
          renderItem={renderItem}
          keyExtractor={(item) => item.projectid.toString()}
          numColumns={2}
          contentContainerStyle={styles.listContent}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBE8A5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
    textAlign: "center",
    color: "#AB2330",
    backgroundColor: "#F5BD02",
  },
  listContent: {
    paddingHorizontal: 10,
  },
  projectItem: {
    flex: 1,
    padding: 8,
    marginVertical: 5,
  },
  projectCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  projectTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#AB2330",
    marginBottom: 5,
  },
  projectDate: {
    fontSize: 14,
    color: "#333",
    marginBottom: 2,
  },
  projectClient: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#F5BD02",
  },
});

export default ProjectScreen;
