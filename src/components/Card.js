import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FAIcon from "react-native-vector-icons/FontAwesome";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STAFF_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU4Yjc3NWMzMWY1MGM5ZTNiZWM3NDMiLCJpYXQiOjE3MDk3NTAxMzN9.cQM3-hYgTDG_59_HvNkZQ7qeSZWrWHl1aLAC699A_2I";

export default function Card({ id, images, author, publishDate, deleteNews }) {
  const isFocus = useIsFocused();

  const [checkRole, setCheckRole] = useState();

  const getAccountStorage = async () => {
    try {
      const data = await AsyncStorage.getItem("Account");
      if (data) {
        const token = JSON.parse(data?.account.tokens[0]);
        setCheckRole(token);
        return token;
      }
    } catch (error) {
      console.error("Error fetching account data:", error);
    }
  };

  useEffect(() => {
    if (isFocus) {
      getAccountStorage();
    }
  }, [isFocus]);

  return (
    // <View className="bg-zinc-200 border-gray-300 border-2 p-2 rounded-2xl mb-4 flex-row items-center justify-between">
    //   <Image
    //     source={{ uri: images }}
    //     className="w-32 h-32 rounded-2xl"
    //     style={{ resizeMode: "cover" }}
    //   />
    //   <View>
    //     <Text className="text-lg">
    //       Date: {moment(publishDate).format("DD/MM/YYYY")}
    //     </Text>
    //     <Text className="text-lg">Author: {author}</Text>
    //   </View>
    //   <TouchableOpacity
    //     className="p-1 rounded-lg self-start"
    //     onPress={() => deleteNews(id)}
    //   >
    //     <FAIcon name={"remove"} size={20} color="red" className="text-red" />
    //   </TouchableOpacity>
    // </View>
    <View style={styles.cardContainer}>
      <Image source={{ uri: images }} style={styles.image} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          Date : {moment(publishDate).format("DD/MM/YYYY")}
        </Text>
        <Text style={styles.text}>Author : {author}</Text>
      </View>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => deleteNews(id)}
      >
        {checkRole === STAFF_TOKEN && (
          <FAIcon name={"remove"} size={20} color="red" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: "#FBE8A5",
    borderColor: "#AB2330",
    borderWidth: 1,
    padding: 10,
    borderRadius: 15,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 164,
    height: 164,
    borderRadius: 15,
    resizeMode: "cover",
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  text: {
    fontSize: 16,
    color: "#AB2330",
  },
  deleteButton: {
    padding: 5,
    borderRadius: 10,
    alignSelf: "flex-start",
  },
});
