import AsyncStorage from "@react-native-async-storage/async-storage";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Button,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Geny, LOGIN, backend_host } from "../constants/api";

function SignIn({ route }) {
  const ADMIN_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5ODA1YTBkYzc5MDgzZjFhYmJkYTciLCJpYXQiOjE3MTA4NTAxMzh9.y8158XhPNg3jDPAZKpS8sw7k8fEBAy-fUQTnmXHR4-E";
  const STAFF_TOKEN =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5N2FlZDZjNTk3MDQyNjdmN2JmMzIiLCJpYXQiOjE3MTA4NDg3NDl9.MrbIEIMRLLubryoHZgvTBGhQeC0L79ZSgtz1iWgZaVo";

  const navigation = useNavigation();

  const isSpecialCharacter = (str) =>
    /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(str);

  const isEmpty = (str) => str.trim() === "";

  const [login, setLogin] = useState({
    username: "",
    password: "",
  });

  const isFocus = useIsFocused();

  useEffect(() => {
    if (isFocus) {
      setLogin({
        username: "",
        password: "",
      });
    }
  }, [isFocus]);

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

      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      const data = await response.json();
      console.log(" Login successfully:", data);
      //set AsyncStorage
      await AsyncStorage.setItem("Account", JSON.stringify(data));
      setLogin({
        username: "",
        password: "",
      });
      if (!response.ok) {
        throw new Error("Failed to register user");
      }
      return data;
    } catch (error) {
      console.error("Error login user:", error);
    }
  };

  const handleSignIn = async () => {
    try {
      const data = await loginUser();
      const token = data?.account.tokens[0];
      console.log("token :", token);
      if (!token) {
        return;
      }
      if (token === ADMIN_TOKEN) {
        navigation.navigate("AdminOverView");
      } else if (token === STAFF_TOKEN) {
        navigation.navigate("StaffOverView");
      } else {
        navigation.navigate("UserOverView");
      }
    } catch (error) {
      console.error("Login or navigation failed:", error);
    }
  };

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
        <View style={{ marginTop: 5, alignSelf: "flex-start" }}>
          <Pressable
            onPress={async () => {
              try {
                console.log("1: ", login.username);
                const response = await fetch(
                  `http://${backend_host}:5000/api/accounts/requestPasswordReset`,
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ username: login.username }),
                  }
                );
                if (response.ok) {
                  console.log("Reset successfully");
                }
              } catch (error) {
                console.log(error);
              }
            }}
          >
            {({ pressed }) => (
              <Text
                style={[
                  styles.signUpText,
                  styles.signUpButtonText,
                  pressed && styles.pressed,
                ]}
              >
                Forgot password?
              </Text>
            )}
          </Pressable>
        </View>
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
