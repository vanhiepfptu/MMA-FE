import React, { useState, useEffect } from "react";
import { View, Image, Text, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import moment from "moment";
import Loading from "../components/Loading";
import { Geny } from "../constants/api";
const API_URL = `http://${Geny}:5000/api/blogs`;
export default function DetailBlogScreen({ route }) {
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
    <View className="flex-1 items-center justify-center">
      {loading ? (
        <Loading />
      ) : (
        news && (
          <>
            <Image
              source={{ uri: news?.images[0] }}
              className="w-64 h-64 mb-8 rounded-2xl"
              style={{ resizeMode: "contain" }}
            />
            <Text className="text-2xl font-bold mb-4">{news?.blogsTitle}</Text>
            <Text className="text-lg mb-6">{news?.blogsContent}</Text>
            <Text className="text-lg">author: {news?.author}</Text>
            <Text className="text-lg">
              publishDate: {moment(news?.publishDate).format("DD/MM/YYYY")}
            </Text>

            {/* <TouchableOpacity
              // onPress={}
              className=" w-20 h-20 p-2 rounded-full bg-gray-200 mb-4 flex items-center justify-center"
            >
              <Icon name={"heart"} size={32} color={"red"} />
            </TouchableOpacity> */}
          </>
        )
      )}
    </View>
  );
}
