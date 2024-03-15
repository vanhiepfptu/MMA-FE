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
import { Geny } from "../constants/api";
const API_URL = `http://${Geny}:5000/api/project`;
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
    <TouchableOpacity onPress={() => goToDetailScreen(item)}>
      <View className="bg-zinc-200 border-gray-300 border-2 p-2 rounded-2xl mb-4 flex-row items-center justify-between">
        {/* <Image
          source={{ uri: item.projectImages[0] }}
          className="w-32 h-32 rounded-2xl"
          style={{ resizeMode: "contain" }}
        /> */}
        <View>
          <Text className="text-2xl font-semibold">{item.projectTitle}</Text>
          <Text className="text-lg">
            startDate: {moment(item.startDate).format("DD/MM/YYYY")}
          </Text>
          <Text className="text-lg">
            endDate: {moment(item.endDate).format("DD/MM/YYYY")}
          </Text>
          <Text className="text-lg">client: {item.client.username}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className="flex-1" style={{ marginTop: top }}>
      <Text>Project List</Text>
      <View className="mb-2" />
      {loading ? (
        <Loading />
      ) : (
        <FlatList
          data={projects}
          renderItem={renderItem}
          keyExtractor={(item) => item.projectid.toString()}
          className="px-4"
        />
      )}
    </View>
  );
};

export default ProjectScreen;
