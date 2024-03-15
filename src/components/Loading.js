import React from "react";
import { ActivityIndicator, View } from "react-native";

export default function Loading() {
  return (
    <View className="justify-center items-center h-4/5">
      <ActivityIndicator size="large" color={"black"} />
    </View>
  );
}
