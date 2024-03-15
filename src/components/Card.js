import React from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
export default function Card({ id,images, author, publishDate, deleteNews }) {
  return (
    <View className="bg-zinc-200 border-gray-300 border-2 p-2 rounded-2xl mb-4 flex-row items-center justify-between">
      <Image
        source={{ uri: images }}
        className="w-32 h-32 rounded-2xl"
        style={{ resizeMode: "contain" }}
      />
      <View>
        {/* <Text className="text-2xl font-semibold">{item.newsTitle}</Text> */}
        <Text className="text-lg">
          date: {moment(publishDate).format("DD/MM/YYYY")}
        </Text>
        <Text className="text-lg">author: {author}</Text>
      </View>
      <TouchableOpacity
        className="p-1 rounded-lg self-start"
        onPress={() => deleteNews(id)}
      >
        <FAIcon name={"remove"} size={20} color="red" className="text-red" />
      </TouchableOpacity>
    </View>
  );
}
