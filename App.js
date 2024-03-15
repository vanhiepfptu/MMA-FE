import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Button, StyleSheet, View } from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";

// // Import screens
// import UserScreen from "./src/UserScreen";
import Charts from "./src/components/Charts";
import SignIn from "./src/components/SignIn";
import SignUp from "./src/components/SignUp";
import StaffScreen from "./src/screens/StaffScreen";
import UserScreen from "./src/screens/UserScreen";
import AdminScreen from "./src/screens/AdminScreen";
import IconButton from "./src/components/IconButton";
import QuotationForm from "./src/components/QuoteForm";
import QuotationList from "./src/components/QuoteList";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import NewsScreen from "./src/screens/NewScreen";
import DetailNewScreen from "./src/screens/DetailNewScreen";
import DetailBlogScreen from "./src/screens/DetailBlogScreen";
import BlogScreen from "./src/screens/BlogScreen";
import ProjectScreen from "./src/screens/ProjectScreen";
import DetailProjectScreen from "./src/screens/DetailProjectScreen";

// Create the stack navigator
const Stack = createNativeStackNavigator();

//Create the stack bottmtab
const BottomTabs = createBottomTabNavigator();

function HomeScreen({ navigation }) {
  return (
    <>
      <StatusBar style="light" />
      <View style={styles.container}>
        <Button
          title="Go to User Screen"
          onPress={() => navigation.navigate("Báo giá chuẩn")}
        />
        <Button
          title="Go to Staff Screen"
          onPress={() => navigation.navigate("StaffOverView")}
        />
        <Button
          title="Go to Chart Screen"
          onPress={() => navigation.navigate("Chart")}
        />
        <Button
          title="Go to SignIn Screen"
          onPress={() => navigation.navigate("SignIn")}
        />
        <Button
          title="Go to SignUp Screen"
          onPress={() => navigation.navigate("SignUp")}
        />
        <Button
          title="Product Detail"
          onPress={() => navigation.navigate("ProductDetailScreen")}
        />
        <Button
          title="Project"
          onPress={() => navigation.navigate("Project")}
        />
      </View>
    </>
  );
}

function AdminOverView() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#F5BD02" },
        headerTintColor: "#AB2330",
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="person"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          ></IconButton>
        ),
        tabBarStyle: { backgroundColor: "#AB2330" },
        tabBarActiveTintColor: "#F5BD02",
        tabBarInactiveTintColor: "#fff",
      })}
    >
      <BottomTabs.Screen
        name="AdminScreen"
        component={AdminScreen}
        options={{
          title: "Admin Screen",
          tabBarLabel: "Admin",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      ></BottomTabs.Screen>
      <BottomTabs.Screen
        name="ChartScreen"
        component={Charts}
        options={{
          title: "Dashboard",
          tabBarLabel: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium" size={size} color={color} />
          ),
        }}
      ></BottomTabs.Screen>
    </BottomTabs.Navigator>
  );
}

function StaffOverView() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#F5BD02" },
        headerTintColor: "#AB2330",
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="person"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          ></IconButton>
        ),
        tabBarStyle: { backgroundColor: "#AB2330" },
        tabBarActiveTintColor: "#F5BD02",
        tabBarInactiveTintColor: "#fff",
      })}
    >
      <BottomTabs.Screen
        name="StaffScreen"
        component={StaffScreen}
        options={{
          title: "Staff Screen",
          tabBarLabel: "Staff Screen",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      ></BottomTabs.Screen>
      <BottomTabs.Screen
        name="StaffNews"
        component={NewsScreen}
        options={{
          title: "News",
          tabBarLabel: "News",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="newspaper-outline" size={size} color={color} />
          ),
        }}
      ></BottomTabs.Screen>
      <BottomTabs.Screen
        name="StaffBlogs"
        component={BlogScreen}
        options={{
          title: "Blogs",
          tabBarLabel: "Blogs",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="book-outline" size={size} color={color} />
          ),
        }}
      ></BottomTabs.Screen>
    </BottomTabs.Navigator>
  );
}

function UserOverView() {
  return (
    <BottomTabs.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: "#F5BD02" },
        headerTintColor: "#AB2330",
        headerRight: ({ tintColor }) => (
          <IconButton
            icon="person"
            size={24}
            color={tintColor}
            onPress={() => {
              navigation.navigate("SignIn");
            }}
          ></IconButton>
        ),
        tabBarStyle: { backgroundColor: "#AB2330" },
        tabBarActiveTintColor: "#F5BD02",
        tabBarInactiveTintColor: "#fff",
      })}
    >
      <BottomTabs.Screen
        name="QuoteForm"
        component={QuotationForm}
        options={{
          title: "Quotation Form",
          tabBarLabel: "Quotation Form",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium" size={size} color={color} />
          ),
        }}
      ></BottomTabs.Screen>
      <BottomTabs.Screen
        name="QuoteList"
        component={QuotationList}
        options={{
          title: "Quotation List",
          tabBarLabel: "Quotation List",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="podium" size={size} color={color} />
          ),
        }}
      ></BottomTabs.Screen>
    </BottomTabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Báo giá chuẩn" component={UserScreen} />
        <Stack.Screen name="Staff" component={StaffScreen} />
        <Stack.Screen name="Chart" component={Charts}></Stack.Screen>
        <Stack.Screen name="SignIn" component={SignIn}></Stack.Screen>
        <Stack.Screen name="SignUp" component={SignUp}></Stack.Screen>
        <Stack.Screen
          name="ProductDetailScreen"
          component={ProductDetailScreen}
        />
        <Stack.Screen
          name="AdminOverView"
          component={AdminOverView}
          options={{ headerShown: false }}
        ></Stack.Screen>
        <Stack.Screen
          name="StaffOverView"
          component={StaffOverView}
          options={({ navigation }) => ({
            headerShown: false,
          })}
        ></Stack.Screen>
        <Stack.Screen name="DetailNew" component={DetailNewScreen} />
        <Stack.Screen name="DetailBlog" component={DetailBlogScreen} />
        <Stack.Screen name="Project" component={ProjectScreen} />
        <Stack.Screen name="DetailProject" component={DetailProjectScreen} />
        <Stack.Screen
          name="UserOverView"
          component={UserOverView}
          options={{ headerShown: false }}
        ></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
