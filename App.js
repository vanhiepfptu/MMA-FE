import * as React from "react";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Button,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StatusBar } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

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
import QuotationStaffScreen from "./src/screens/QuotationStaff";
import ProductScreen from "./src/screens/ProductScreen";
import ProductControl from "./src/screens/ProductControl";
import ManageProduct from "./src/screens/ManageProduct";
import News from "./src/screens/News";
import Blogs from "./src/screens/Blogs";
import AccountDetail from "./src/screens/AccountDetail";

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
          title="Go to SignIn Screen"
          onPress={() => navigation.navigate("SignIn")}
        />
        <Button
          title="Go to SignUp Screen"
          onPress={() => navigation.navigate("SignUp")}
        />
        <Button
          title="Go to Staff Screen"
          onPress={() => navigation.navigate("StaffOverView")}
        />
        <Button
          title="Go to Admin Screen"
          onPress={() => navigation.navigate("AdminOverView")}
        />
        <Button
          title="Go to User Screen"
          onPress={() => navigation.navigate("UserOverView")}
        />
      </View>
    </>
  );
}

//ADMIN
function AdminOverView() {
  const navigation = useNavigation();

  function handleSignOut() {
    navigation.navigate("AccountDetail");
  }

  return (
    <>
      <BottomTabs.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: "#F5BD02" },
          headerTintColor: "#AB2330",
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="person"
              size={24}
              color={tintColor}
              onPress={handleSignOut}
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
            title: "Manage Accounts",
            tabBarLabel: "Manage Accounts",
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
    </>
  );
}

//STAFF
function StaffOverView() {
  const navigation = useNavigation();

  function handleSignOut() {
    navigation.navigate("AccountDetail");
  }
  return (
    <>
      <BottomTabs.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: "#F5BD02" },
          headerTintColor: "#AB2330",
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="person"
              size={24}
              color={tintColor}
              onPress={handleSignOut}
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
            title: "Product Control",
            tabBarLabel: "Add Product",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home" size={size} color={color} />
            ),
          }}
        ></BottomTabs.Screen>
        <BottomTabs.Screen
          name="ManageProduct"
          component={ManageProduct}
          options={{
            title: "Manage Product",
            tabBarLabel: "Manage Product",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="settings" size={size} color={color} />
            ),
          }}
        ></BottomTabs.Screen>
        <BottomTabs.Screen
          name="StaffQuotations"
          component={QuotationStaffScreen}
          options={{
            title: "Quotations",
            tabBarLabel: "Quotations",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
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
    </>
  );
}

//USER
function UserOverView() {
  const navigation = useNavigation();

  function handleSignOut() {
    navigation.navigate("AccountDetail");
  }
  return (
    <>
      <BottomTabs.Navigator
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: "#F5BD02" },
          headerTintColor: "#AB2330",
          headerRight: ({ tintColor }) => (
            <IconButton
              icon="person"
              size={24}
              color={tintColor}
              onPress={handleSignOut}
            ></IconButton>
          ),
          tabBarStyle: { backgroundColor: "#AB2330" },
          tabBarActiveTintColor: "#F5BD02",
          tabBarInactiveTintColor: "#fff",
        })}
      >
        <BottomTabs.Screen
          name="Product"
          component={ProductScreen}
          options={{
            title: "Products Menu",
            tabBarLabel: "Menu",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="basket" size={size} color={color} />
            ),
          }}
        ></BottomTabs.Screen>
        <BottomTabs.Screen
          name="Báo giá chuẩn"
          component={UserScreen}
          options={{
            title: "Quotation Form",
            tabBarLabel: "Quotation Form",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="browsers" size={size} color={color} />
            ),
          }}
        ></BottomTabs.Screen>
        <BottomTabs.Screen
          name="Project"
          component={ProjectScreen}
          options={{
            title: "Typical Projects",
            tabBarLabel: "Typical Projects",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="document" size={size} color={color} />
            ),
          }}
        ></BottomTabs.Screen>
        <BottomTabs.Screen
          name="News"
          component={News}
          options={{
            title: "News",
            tabBarLabel: "News",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="newspaper-outline" size={size} color={color} />
            ),
          }}
        ></BottomTabs.Screen>
        <BottomTabs.Screen
          name="Blogs"
          component={Blogs}
          options={{
            title: "Blogs",
            tabBarLabel: "Blogs",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="book-outline" size={size} color={color} />
            ),
          }}
        ></BottomTabs.Screen>
      </BottomTabs.Navigator>
    </>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="SignIn"
          screenOptions={({ navigation }) => ({
            headerStyle: { backgroundColor: "#F5BD02" },
            headerTintColor: "#AB2330",
          })}
        >
          <Stack.Screen
            name="SignIn"
            component={SignIn}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="SignUp"
            component={SignUp}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="AdminOverView"
            component={AdminOverView}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="StaffOverView"
            component={StaffOverView}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="UserOverView"
            component={UserOverView}
            options={{ headerShown: false }}
          ></Stack.Screen>
          <Stack.Screen
            name="ProductDetailScreen"
            component={ProductDetailScreen}
          />
          <Stack.Screen
            name="StaffQuotations"
            component={QuotationStaffScreen}
          />
          <Stack.Screen
            name="AccountDetail"
            component={AccountDetail}
            options={{ title: "Account" }}
          ></Stack.Screen>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Báo giá chuẩn" component={UserScreen} />
          <Stack.Screen name="Staff" component={StaffScreen} />
          <Stack.Screen name="Chart" component={Charts}></Stack.Screen>
          <Stack.Screen name="News" component={News}></Stack.Screen>
          <Stack.Screen name="Blogs" component={Blogs}></Stack.Screen>
          <Stack.Screen name="Product" component={ProductScreen} />
          <Stack.Screen name="ProductControl" component={ProductControl} />
          <Stack.Screen name="ManageProduct" component={ManageProduct} />
          <Stack.Screen name="DetailNew" component={DetailNewScreen} />
          <Stack.Screen name="DetailBlog" component={DetailBlogScreen} />
          <Stack.Screen name="Project" component={ProjectScreen} />
          <Stack.Screen name="DetailProject" component={DetailProjectScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FFFF",
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
    fontSize: 15,
    marginBottom: 15,
    textAlign: "center",
    color: "#AB2330",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    backgroundColor: "#F5BD02",
    padding: 10,
    borderRadius: 6,
  },
  buttonText: {
    fontSize: 12,
    color: "#AB2330",
  },
});
