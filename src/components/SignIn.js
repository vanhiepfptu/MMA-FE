import React, { useState } from "react";
import {
  Button,
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import {
  useFocusEffect,
  useIsFocused,
  useNavigation,
} from "@react-navigation/native";
import { LOGIN } from "../constants/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

function SignIn({ route }) {
  const ADMIN_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU4NjFlOTJiNWVlYTI4NTU2NDJiM2IiLCJpYXQiOjE3MDk3MjgyMzN9.PlJnL2HO8BExwcleE-aZP5L5c45njL0RDk1jKmaYyXg";
  const STAFF_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWU4Yjc3NWMzMWY1MGM5ZTNiZWM3NDMiLCJpYXQiOjE3MDk3NTAxMzN9.cQM3-hYgTDG_59_HvNkZQ7qeSZWrWHl1aLAC699A_2I";

  const navigation = useNavigation();

  const isSpecialCharacter = (str) =>
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);
  const isEmpty = (str) => str.trim() === "";

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });

  const inputChangedHandler = (field, value) => {
    setLogin((preState) => ({
      ...preState,
      [field]: value,
    }));
    setErrors((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const loginUser = async () => {
    try {
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(login),
      });
      const data = await response.json();
      console.log("Login successfully:", data);
      //reset Login State
      setLogin({
        username: "",
        password: "",
      });
      //set AsyncStorage
      await AsyncStorage.setItem("Account", JSON.stringify(data));
      navigation.navigate("StaffOverView");
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
    } catch (error) {
      console.error("Error login user:", error);
    }
  };

  const handleSignIn = async () => {
    loginUser();
    const AccountStorage = await AsyncStorage.getItem("Account");
    const tokens = JSON.parse(AccountStorage)?.account.tokens[0];
    if (AccountStorage) {
      console.log("Account Token :", tokens);
      console.log("Adninnn token :", ADMIN_TOKEN);
      console.log("Staff token :", STAFF_TOKEN);
      switch (tokens) {
        case ADMIN_TOKEN:
          console.log("ADMIN SCREEN");
          navigation.navigate("AdminOverView");
          break;
        case STAFF_TOKEN:
          console.log("STAFF SCREEN");
          navigation.navigate("StaffOverView");
          break;
        default:
          console.log("USER SCREEN");
          navigation.navigate("UserOverView");
          break;
      }
    }
  };

  // function NavigateToAdmin() {
  //   navigation.navigate("AdminOverView");
  // }

  // function NavigateToStaff() {
  //   navigation.navigate("StaffOverView");
  // }

  // function NavigateToUser() {
  //   navigation.navigate("UserOverView");
  // }

  return (
    <ImageBackground
      source={require("../images/Background-SingIn.jpg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Sign In</Text>
        <TextInput
          style={styles.input}
          placeholder="Username"
          placeholderTextColor="#fff"
          value={login.username}
          onChangeText={inputChangedHandler.bind(this, "username")}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#fff"
          value={login.password}
          onChangeText={inputChangedHandler.bind(this, "password")}
          secureTextEntry
        />
        <Button color="#F5BD02" title="Sign in" onPress={handleSignIn} />
        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>You do not have an account? </Text>
          <Pressable onPress={() => navigation.navigate("SignUp")}>
            {({ pressed }) => (
              <Text
                style={[
                  styles.signUpText,
                  styles.signUpButtonText,
                  pressed && styles.pressed,
                ]}
              >
                Sign up here
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
}

export default SignIn;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5BD02",
    opacity: 0.88,
  },
  container: {
    width: "80%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#AB2330",
    borderRadius: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#F5BD02",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 10,
    fontSize: 14,
    color: "#333",
  },
  signUpContainer: {
    flexDirection: "row",
    marginTop: 10,
  },
  signUpText: {
    color: "#fff",
    fontSize: 16,
  },
  signUpButtonText: {
    color: "#F5BD02",
  },
  pressed: {
    opacity: 0.5,
  },
});
