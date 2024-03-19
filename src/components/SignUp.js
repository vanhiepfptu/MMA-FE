import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  Button,
  Dimensions,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { REGISTER } from "../constants/api";

const screenHeight = Dimensions.get("window").height;

function SignUp({}) {
  const navigation = useNavigation();

  const [register, setRegister] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    username: "",
    password: "",
  });

  const [confirmPw, setConfirmPw] = useState("");

  const inputChangedHandler = (field, value) => {
    setRegister((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };

  const HandleSubmit = () => {
    if (register?.password === confirmPw) {
      const registerNewUser = async () => {
        try {
          const response = await fetch(REGISTER, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(register),
          });
          if (!response.ok) {
            throw new Error("Failed to register user");
          }
          const data = await response.json();
          console.log("Registration successfully:", data);
          //Reset Register State
          setRegister({
            firstName: "",
            lastName: "",
            email: "",
            dateOfBirth: "",
            address: "",
            phone: "",
            username: "",
            password: "",
          });
          navigation.navigate("SignIn");
        } catch (error) {
          console.error("Error registering user:", error);
        }
      };
      registerNewUser();
    }
    console.log("register :", register);
  };

  return (
    <ScrollView style={styles.scrollView}>
      <ImageBackground
        source={require("../images/Background_SignUp.jpg")}
        style={styles.background}
      >
        <View style={styles.container}>
          <Text style={styles.title}>Sign Up</Text>
          <View style={styles.nameContainer}>
            <TextInput
              style={styles.input}
              placeholder="Firstname"
              placeholderTextColor="#fff"
              value={register.firstName}
              onChangeText={inputChangedHandler.bind(this, "firstName")}
            />
            <TextInput
              style={styles.input}
              placeholder="Lastname"
              placeholderTextColor="#fff"
              value={register.lastName}
              onChangeText={inputChangedHandler.bind(this, "lastName")}
            />
          </View>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#fff"
            value={register.email}
            onChangeText={inputChangedHandler.bind(this, "email")}
          />
          <TextInput
            style={styles.input}
            placeholder="Date Of Birth"
            placeholderTextColor="#fff"
            value={register.dateOfBirth}
            onChangeText={inputChangedHandler.bind(this, "dateOfBirth")}
          />
          <TextInput
            style={styles.input}
            placeholder="Phone number"
            placeholderTextColor="#fff"
            value={register.phone}
            onChangeText={inputChangedHandler.bind(this, "phone")}
          />
          <TextInput
            style={styles.input}
            placeholder="Address"
            placeholderTextColor="#fff"
            value={register.address}
            onChangeText={inputChangedHandler.bind(this, "address")}
          />
          <TextInput
            style={styles.input}
            placeholder="Username"
            placeholderTextColor="#fff"
            value={register.username}
            onChangeText={inputChangedHandler.bind(this, "username")}
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#fff"
            value={register.password}
            onChangeText={inputChangedHandler.bind(this, "password")}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Re-enter Password"
            placeholderTextColor="#fff"
            value={confirmPw}
            onChangeText={(value) => {
              setConfirmPw(value);
            }}
            secureTextEntry
          />
          <Button color="#F5BD02" title="Register" onPress={HandleSubmit} />
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>You already have account? </Text>
            <Pressable onPress={() => navigation.navigate("SignIn")}>
              {({ pressed }) => (
                <Text
                  style={[
                    styles.signUpText,
                    styles.signUpButtonText,
                    pressed && styles.pressed,
                  ]}
                >
                  Sign in here
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </ImageBackground>
    </ScrollView>
  );
}

export default SignUp;

const styles = StyleSheet.create({
  background: {
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.86,
    height: screenHeight,
  },
  container: {
    width: "80%",
    maxWidth: 400,
    padding: 20,
    backgroundColor: "#AB2330",
    borderRadius: 10,
  },
  scrollView: {
    flex: 1,
    heigh: "100%",
  },
  nameContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 4,
    marginBottom: 10,
    fontSize: 16,
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
