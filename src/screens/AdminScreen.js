import { Ionicons } from "@expo/vector-icons";
import { useIsFocused } from "@react-navigation/native";
import { useEffect, useState } from "react";
import {
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Geny } from "../constants/api";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5ODA1YTBkYzc5MDgzZjFhYmJkYTciLCJpYXQiOjE3MTA4NTAxMzh9.y8158XhPNg3jDPAZKpS8sw7k8fEBAy-fUQTnmXHR4-E";
const STAFF_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5N2FlZDZjNTk3MDQyNjdmN2JmMzIiLCJpYXQiOjE3MTA4NDg3NDl9.MrbIEIMRLLubryoHZgvTBGhQeC0L79ZSgtz1iWgZaVo";

const ID_CUSTOMER = "65ddd2807298f652b9db91b6";

const ID_STAFF = "65dde68c182b6227b06896be";

const ID_ADMIN = "65ddd26e7298f652b9db91b2";

function AdminScreen() {
  const isFocus = useIsFocused();

  const [fetchData, setFetchData] = useState([]);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [selectedItem, setSelectedItem] = useState(null);

  const [accountStorage, setAccountStorage] = useState({});

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [isRegisterModalVisible, setIsRegisterModalVisible] = useState(false);

  const [editFormData, setEditFormData] = useState({
    accountId: "",
    firstName: "",
    lastName: "",
    email: "",
    roleId: "",
    status: "",
  });

  const [registerFormData, setRegisterFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    username: "",
    password: "",
  });

  const getAccountStorage = async () => {
    try {
      const data = await AsyncStorage.getItem("Account");
      setAccountStorage(JSON.parse(data));
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      throw error;
    }
  };

  const getALlAccounts = async () => {
    try {
      const response = await fetch(`http://${Geny}:5000/api/accounts/all`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
      });

      if (!response.ok) {
        throw new Error("Network response was not ok.");
      }

      const data = await response.json();
      setFetchData(data);
      return data;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
      throw error;
    }
  };

  useEffect(() => {
    if (isFocus) {
      getALlAccounts();
      getAccountStorage();
    }
  }, [isFocus]);

  const handlePressDelete = (item) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const handlePressEdit = (item) => {
    const getRoleIdFromRoleName = (roleName) => {
      switch (roleName) {
        case "customer":
          return ID_CUSTOMER;
        case "staff":
          return ID_STAFF;
        case "admin":
          return ID_ADMIN;
        default:
          return "";
      }
    };
    setEditFormData({
      accountId: item.accountId,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      roleId: getRoleIdFromRoleName(item.roleName),
      status: item.status,
    });
    console.log();
    setIsEditModalVisible(true);
  };

  async function deleteAccount(accountId) {
    try {
      const response = await fetch(
        `http://10.0.3.2:5000/api/accounts/${accountId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(
          `Error! status: ${response.status}, statusText: ${response.statusText}`
        );
      }
      const result = await response.json();
      console.log("Account deleted successfully:", result);
      //   Alert.alert("Success", "Delete successfully !");
      return result;
    } catch (error) {
      console.error("Failed to delete account:", error);
      Alert.alert("Danger", error);
    }
  }

  async function updateAccount() {
    try {
      let editData = {
        firstName: editFormData.firstName,
        lastName: editFormData.lastName,
        email: editFormData.email,
        roleId: editFormData.roleId,
        status: editFormData.status,
      };
      const response = await fetch(
        `http://10.0.3.2:5000/api/accounts/profile/${editFormData.accountId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${ADMIN_TOKEN}`,
          },
          body: JSON.stringify(editData),
        }
      );
      console.log("new edit form:", editData);
      console.log("id edit:", editFormData.accountId);
      if (!response.ok) {
        throw new Error(
          `Error! status: ${response.status}, ${response.statusText}`
        );
      }
      setEditFormData({
        accountId: "",
        firstName: "",
        lastName: "",
        email: "",
        roleId: "",
        status: "",
      });
      const result = await response.json();
      console.log("Profile updated successfully:", result);
      return result;
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  }

  const handleRegisterStaffAccount = async () => {
    const url = "http://10.0.3.2:5000/api/accounts/register/staff";

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${ADMIN_TOKEN}`,
        },
        body: JSON.stringify(registerFormData),
      });

      if (!response.ok) {
        throw new Error("Failed to register account");
      }
      const result = await response.json();
      setRegisterFormData({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        address: "",
        phone: "",
        username: "",
        password: "",
      });
      console.log("Account registered successfully:", result);
      setIsRegisterModalVisible(false);
    } catch (error) {
      console.error("Error during registration:", error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.content}>
        <Text style={styles.title}>
          {item.firstName} {item.lastName}
        </Text>
        <Text style={styles.text}>Email: {item.email}</Text>
        <Text style={styles.text}>Phone: {item.phone}</Text>
        <Text style={styles.text}>Role: {item.roleName}</Text>
        <Text style={styles.text}>Status: {item.status}</Text>
      </View>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => handlePressEdit(item)}>
          <Ionicons
            name="create-outline"
            size={24}
            color="#3171d8"
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handlePressDelete(item)}>
          <Ionicons
            name="trash-outline"
            size={24}
            color="#d83131"
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setIsRegisterModalVisible(true)}
      >
        <Text style={styles.addButtonText}>Add Staff Account</Text>
      </TouchableOpacity>
      <FlatList
        data={fetchData}
        renderItem={renderItem}
        keyExtractor={(item) => item.accountId}
      />

      {/* DELETE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => {
          setIsModalVisible(!isModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>
              You want to delete this account?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  console.log("Deleting: ", selectedItem);
                  deleteAccount(selectedItem.accountId);
                  setIsModalVisible(!isModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setIsModalVisible(!isModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* UPDATE MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isEditModalVisible}
        onRequestClose={() => {
          setIsEditModalVisible(!isEditModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Edit Account</Text>
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setEditFormData({ ...editFormData, firstName: text })
              }
              value={editFormData.firstName}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setEditFormData({ ...editFormData, lastName: text })
              }
              value={editFormData.lastName}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setEditFormData({ ...editFormData, email: text })
              }
              value={editFormData.email}
              keyboardType="email-address"
              placeholder="Email"
            />
            {false && (
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setEditFormData({ ...editFormData, password: text })
                }
                value={editFormData.password}
                //secureTextEntry={true}
                placeholder="Password"
              />
            )}
            {false && (
              <TextInput
                style={styles.input}
                onChangeText={(text) =>
                  setEditFormData({ ...editFormData, roleId: text })
                }
                value={editFormData.roleId}
                placeholder="Role ID"
              />
            )}
            <Picker
              selectedValue={editFormData.status}
              style={styles.picker}
              onValueChange={(itemValue, itemIndex) =>
                setEditFormData({ ...editFormData, status: itemValue })
              }
            >
              <Picker.Item label="Active" value="active" />
              <Picker.Item label="In-Active" value="inactive" />
            </Picker>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonUpdate]}
                onPress={() => {
                  updateAccount();
                  getALlAccounts();
                  console.log("Updating account with: ", editFormData);
                  setIsEditModalVisible(!isEditModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => setIsEditModalVisible(!isEditModalVisible)}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* REGISTER MODAL */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isRegisterModalVisible}
        onRequestClose={() => {
          setIsRegisterModalVisible(!isRegisterModalVisible);
        }}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Register Staff Account</Text>
            {/* Các TextInput cho việc nhập thông tin */}
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setRegisterFormData({ ...registerFormData, firstName: text })
              }
              value={registerFormData.firstName}
              placeholder="First Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setRegisterFormData({ ...registerFormData, lastName: text })
              }
              value={registerFormData.lastName}
              placeholder="Last Name"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setRegisterFormData({ ...registerFormData, email: text })
              }
              value={registerFormData.email}
              placeholder="Email"
              keyboardType="email-address"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setRegisterFormData({ ...registerFormData, dateOfBirth: text })
              }
              value={registerFormData.dateOfBirth}
              placeholder="Date Of Birth (YYYY-MM-DD)"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setRegisterFormData({ ...registerFormData, address: text })
              }
              value={registerFormData.address}
              placeholder="Address"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setRegisterFormData({ ...registerFormData, phone: text })
              }
              value={registerFormData.phone}
              placeholder="Phone"
              keyboardType="phone-pad"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setRegisterFormData({ ...registerFormData, username: text })
              }
              value={registerFormData.username}
              placeholder="Username"
            />
            <TextInput
              style={styles.input}
              onChangeText={(text) =>
                setRegisterFormData({ ...registerFormData, password: text })
              }
              value={registerFormData.password}
              placeholder="Password"
              secureTextEntry={true}
            />

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  console.log("Registering Staff Account...", registerFormData);
                  handleRegisterStaffAccount();
                  setIsRegisterModalVisible(!isRegisterModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Register</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setIsRegisterModalVisible(!isRegisterModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

export default AdminScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FBE8A5",
  },
  card: {
    backgroundColor: "#fff",
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderWidth: 1,
    borderColor: "#AB2330",
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#F5BD02",
    marginBottom: 5,
  },
  text: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
  },
  iconContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  icon: {
    marginLeft: 15,
  },
  // Style MODAL
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "#FBE8A5",
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 15,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    marginHorizontal: 10,
  },
  buttonClose: {
    backgroundColor: "#AB2330",
  },
  buttonCancel: {
    backgroundColor: "#F5BD02",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    color: "#AB2330",
  },
  //style them cho edit modal
  input: {
    height: 40,
    minWidth: "80%",
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    backgroundColor: "#FBE8A5",
    borderColor: "#AB2330",
    borderRadius: 6,
    color: "#AB2330",
  },
  buttonUpdate: {
    backgroundColor: "#4CAF50",
  },
  picker: {
    height: 50,
    minWidth: "80%",
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    borderColor: "#AB2330",
    borderRadius: 6,
  },
  //REGISTER MODAL
  addButton: {
    backgroundColor: "#F5BD02",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignSelf: "center",
  },
  addButtonText: {
    color: "#AB2330",
    fontSize: 16,
  },
  modalTitle: {
    marginBottom: 15,
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 18,
  },
});
