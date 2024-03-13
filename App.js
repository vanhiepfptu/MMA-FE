import * as React from "react";
import { Button, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


// // Import screens
// import UserScreen from "./src/UserScreen";
import UserScreen from "./src/screens/UserScreen";
import StaffScreen from "./src/screens/StaffScreen";
import ProductScreen from "./src/screens/ProductScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";

// Create the stack navigator
const Stack = createNativeStackNavigator();

function HomeScreen({ navigation }) {
  return (
    <View>
      <Button
        title="Go to User Screen"
        onPress={() => navigation.navigate("Báo giá chuẩn")}
      />
      <Button
        title="Go to Staff Screen"
        onPress={() => navigation.navigate("Staff")}
      />
      <Button
        title="Product!"
        onPress={() => navigation.navigate("Product")}
      />
      <Button
        title="Product Detail"
        onPress={() => navigation.navigate("ProductDetailScreen")}
      />
      {/* <StatusBar style="auto" /> */}
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Báo giá chuẩn" component={UserScreen} />
        <Stack.Screen name="Staff" component={StaffScreen} />
        <Stack.Screen name="Product" component={ProductScreen} />
        <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
