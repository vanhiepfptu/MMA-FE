import {
  Button,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

function AccountDetail() {
  const navigation = useNavigation();

  const [account, setAccount] = useState(null);

  const isFocus = useIsFocused();

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

  // const account = {
  //   _id: "65e861e92b5eea2855642b3b",
  //   firstName: "Duy",
  //   lastName: "Hieu",
  //   dateOfBirth: "2023-01-01T00:00:00.000Z",
  //   username: "admin02",
  //   email: "admin02@gmail.com",
  //   address: "120 nguyễn tri phương, p7, tp.vũng tàu",
  //   phone: "0369776640",
  //   roleId: "65ddd26e7298f652b9db91b2",
  //   status: "active",
  //   lastLogin: "2024-03-18T08:24:33.270Z",
  //   createdAt: "2024-03-06T12:30:33.597Z",
  //   updatedAt: "2024-03-18T08:24:33.274Z",
  // };

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
        navigation.navigate("Home"); //EDIT
      })
      .catch((error) =>
        console.error("Failed to remove account from storage", error)
      );
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
          <Button color="#AB2330" title="Sign Out" onPress={handleSignOut} />
        </ScrollView>
      </View>
      {/* MODAL */}
      <Modal animationType="slide" transparent={true} visible={modalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Bạn muốn đăng xuất ?</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={handleConfirm}>
                <Text style={styles.buttonText}>Chấp nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={handleCancel}>
                <Text style={styles.buttonText}>Hủy bỏ</Text>
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
    borderRadius: 15,
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
