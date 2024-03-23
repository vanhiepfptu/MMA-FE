import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";

const ADMIN_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NWY5ODA1YTBkYzc5MDgzZjFhYmJkYTciLCJpYXQiOjE3MTA4NTAxMzh9.y8158XhPNg3jDPAZKpS8sw7k8fEBAy-fUQTnmXHR4-E";

function AccountDetail() {
  const navigation = useNavigation();

  const [account, setAccount] = useState(null);

  const isFocus = useIsFocused();

  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  const [editFormData, setEditFormData] = useState({
    accountId: "",
    firstName: "",
    lastName: "",
    email: "",
    roleId: "",
    status: "",
  });

  const getAccountStorage = async () => {
    try {
      const data = await AsyncStorage.getItem("Account");
      if (data !== null) {
        const parseData = JSON.parse(data);
        console.log("Account in Storage:", parseData?.account.firstName);
        setAccount(JSON.parse(data));
      } else {
        console.log("Account not found in Storage.");
      }
    } catch (error) {
      console.error("Error getting account from storage:", error);
    }
  };

  useEffect(() => {
    if (isFocus) {
      getAccountStorage();
    }
  }, [isFocus]);

  const handleSignOut = () => {
    openModal(true);
  };

  const [modalVisible, setModalVisible] = useState(false);

  function openModal() {
    setModalVisible(true);
  }

  function handleConfirm() {
    handleLogout();
    setModalVisible(false);
  }

  function handleCancel() {
    setModalVisible(false);
  }

  function handleLogout() {
    AsyncStorage.removeItem("Account")
      .then(() => {
        console.log("Account removed from storage.");
        navigation.navigate("SignIn");
      })
      .catch((error) =>
        console.error("Failed to remove account from storage", error)
      );
  }

  function handleEditProfile() {
    setEditFormData({
      accountId: account?.account._id,
      firstName: account?.account.firstName,
      lastName: account?.account.lastName,
      email: account?.account.email,
      roleId: account?.account.roleId,
      status: account?.account.status,
    });
    setIsEditModalVisible(true);
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
      if (!response.ok) {
        throw new Error(
          `Error! status: ${response.status}, ${response.statusText}`
        );
      }
      setAccount((prevState) => {
        const updatedAccount = {
          ...prevState,
          account: {
            ...prevState.account,
            firstName: editFormData.firstName,
            lastName: editFormData.lastName,
            email: editFormData.email,
          },
        };
        AsyncStorage.setItem("Account", JSON.stringify(updatedAccount)).catch(
          (error) =>
            console.error(
              "Failed to save updated account to AsyncStorage",
              error
            )
        );
        return updatedAccount;
      });
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

  return (
    <View style={styles.upperContainer}>
      <View style={styles.container}>
        <ScrollView
          style={styles.scrollContainer}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={100} color="#AB2330" />
            <Text style={styles.username}>{account?.account.username}</Text>
          </View>
          <View style={styles.detailsCard}>
            <Text style={styles.detailText}>
              First Name: {account?.account.firstName}
            </Text>
            <Text style={styles.detailText}>
              Last Name: {account?.account.lastName}
            </Text>
            <Text style={styles.detailText}>
              Date of Birth:
              {new Date(account?.account.dateOfBirth).toLocaleDateString()}
            </Text>
            <Text style={styles.detailText}>
              Email: {account?.account.email}
            </Text>
            <Text style={styles.detailText}>
              Address: {account?.account.address}
            </Text>
            <Text style={styles.detailText}>
              Phone: {account?.account.phone}
            </Text>
            <Text style={styles.detailText}>
              Account Status: {account?.account.status}
            </Text>
            <Text style={styles.detailText}>
              Last Login:{" "}
              {new Date(account?.account.lastLogin).toLocaleString()}
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "80%",
            }}
          >
            <TouchableOpacity
              onPress={handleEditProfile}
              style={{
                minWidth: "30%",
                backgroundColor: "#AB2330",
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Update Profile
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignOut}
              style={{
                minWidth: "30%",
                backgroundColor: "#AB2330",
                padding: 10,
                borderRadius: 20,
              }}
            >
              <Text style={{ color: "white", textAlign: "center" }}>
                Sign Out
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>

      {/* MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Sign Out ?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Cancel</Text>
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
            <Text style={styles.modalText}>Update Account</Text>
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
            {false && (
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
            )}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.buttonUpdate]}
                onPress={() => {
                  updateAccount();
                  setIsEditModalVisible(!isEditModalVisible);
                }}
              >
                <Text style={styles.textStyle}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.buttonCancel]}
                onPress={() => {
                  setIsEditModalVisible(!isEditModalVisible);
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

export default AccountDetail;

const styles = StyleSheet.create({
  upperContainer: {
    flex: 1,
    backgroundColor: "#FBE8A5",
  },
  container: {
    flex: 1,
    backgroundColor: "#F5BD02",
    marginHorizontal: 10,
    marginVertical: 20,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#AB2330",
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  username: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#AB2330",
    marginTop: 10,
  },
  detailsCard: {
    backgroundColor: "#FBE8A5",
    padding: 20,
    borderRadius: 20,
    marginVertical: 20,
    width: "100%",
    alignSelf: "center",
  },
  detailText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  //STYLE MODAL
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
  modalText: {
    fontSize: 16,
    marginBottom: 15,
    textAlign: "center",
    color: "#AB2330",
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    marginTop: 15,
  },
  button: {
    backgroundColor: "#F5BD02",
    padding: 12,
    borderRadius: 20,
    elevation: 2,
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 14,
    color: "#AB2330",
    fontWeight: "bold",
    textAlign: "center",
  },
  //Edit Modal
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
  buttonCancel: {
    backgroundColor: "#F5BD02",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  picker: {
    height: 50,
    minWidth: "80%",
    marginVertical: 8,
    borderWidth: 1,
    padding: 10,
    borderColor: "#AB2330",
    borderRadius: 20,
  },
});
