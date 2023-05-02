import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Image,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Alert,
  ScrollView,
  Pressable,
} from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { database } from "../config/firebase";
import { doc, setDoc } from "firebase/firestore";
import * as ImagePicker from "expo-image-picker";

export default function Signup({ navigation }) {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState({
    uri: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
  });

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0]);
    }
  };

  const onHandleSignup = () => {
    if (email !== "" && password !== "") {
      const { userComplete } = createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
        .then((userCredential) => {
          const user = userCredential._tokenResponse.email;
          const myUserUid = auth.currentUser.uid;
          const userInfo = {
            username,
            image: image.uri,
          };
          setDoc(doc(database, "users", `${myUserUid}`), {
            email: user,
            username: userInfo.username,
            displayName: fName + " " + lName,
            photoURL: userInfo.image,
          });

          updateProfile(userComplete, {
            displayName: fName + " " + lName,
            photoURL: userInfo.image,
          });

          auth.currentUser.reload();
        })
        .catch((err) => {
          Alert.alert("Login error", err.message);
          clearInputs();
        });
    }
  };

  const clearInputs = () => {
    setEmail("");
    setPassword("");
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.whiteSheet} />
      <SafeAreaView style={styles.form}>
        <Text style={styles.title}>Sign Up</Text>
        <Pressable title="Upload Image" onPress={pickImage}>
          <Image
            source={{
              uri:
                image.uri ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png",
            }}
            style={styles.imageIcon}
          />
          {image.uri ===
            "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png" && (
            <Text className="text-center text-red-500 font-bold mb-5">
              Upload Profile Picture
            </Text>
          )}
        </Pressable>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
          }}
        >
          <TextInput
            style={styles.rowInput}
            placeholder="Enter first name"
            autoCapitalize="none"
            textContentType="fName"
            autoFocus={true}
            value={fName}
            onChangeText={(text) => setFName(text)}
          />
          <TextInput
            style={styles.rowInput}
            placeholder="Enter last name"
            autoCapitalize="none"
            textContentType="lName"
            autoFocus={true}
            value={lName}
            onChangeText={(text) => setLName(text)}
          />
        </View>
        <TextInput
          style={styles.input}
          placeholder="Enter username"
          autoCapitalize="none"
          textContentType="username"
          autoFocus={true}
          value={username}
          onChangeText={(text) => setUsername(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          textContentType="emailAddress"
          autoFocus={true}
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Enter password"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry={true}
          textContentType="password"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <TouchableOpacity style={styles.button} onPress={onHandleSignup}>
          <Text style={{ fontWeight: "bold", color: "#fff", fontSize: 18 }}>
            {" "}
            Sign Up
          </Text>
        </TouchableOpacity>
        <View
          style={{
            marginTop: 20,
            flexDirection: "row",
            alignItems: "center",
            alignSelf: "center",
          }}
        >
          <Text style={{ color: "gray", fontWeight: "600", fontSize: 14 }}>
            Already have an account?
          </Text>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Login");
              clearInputs();
            }}
          >
            <Text style={{ color: "red", fontWeight: "600", fontSize: 14 }}>
              {" "}
              Log In
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
      <StatusBar barStyle="light-content" />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: "black",
    alignSelf: "center",
    paddingBottom: 24,
  },
  input: {
    backgroundColor: "#F6F7FB",
    height: 58,
    marginBottom: 20,
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
  },
  whiteSheet: {
    width: "100%",
    height: "10%",
    bottom: 0,
    backgroundColor: "#fff",
    borderTopLeftRadius: 60,
  },
  form: {
    flex: 1,
    justifyContent: "center",
    marginHorizontal: 30,
  },
  button: {
    backgroundColor: "black",
    height: 58,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
  },
  imageIcon: {
    alignSelf: "center",
    paddingBottom: 24,
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  rowInput: {
    backgroundColor: "#F6F7FB",
    height: 58,
    width: "45%",
    fontSize: 16,
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
});
