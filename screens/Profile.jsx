import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native";
import { getAuth, signOut } from "firebase/auth";
import { collection, doc, getDoc } from "firebase/firestore";
import { database } from "../config/firebase";
import { Alert } from "react-native";

const Profile = () => {
  const auth = getAuth();
  const [icon, setIcon] = useState();
  const [name, setName] = useState();

  useEffect(() => {
    getUserIcon(auth.currentUser.uid)
    console.log(name)
  }, [])

  const getUserIcon = async (id) => {
    const colRef = collection(database, "users");
    const docRef = doc(colRef, id);
    try {
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const userData = docSnap.data();
        setIcon(userData.photoURL);
        let toPascalCase = str => (str.match(/[a-zA-Z0-9]+/g) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join(' ');
        setName(toPascalCase(userData.displayName));
      } else {
        return null;
      }
    } catch (error) {
      Alert.alert("Error getting document:", error);
      return null;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Image
          style={styles.coverPhoto}
          source={{
            uri: auth.currentUser.photoURL,
          }}
        />
        <View style={styles.profileContainer}>
          <Image
            style={styles.profilePhoto}
            source={{
              uri: icon,
            }}
          />
          <Text style={styles.nameText}>{name}</Text>
        </View>
      </View>
      {/* <View style={styles.bioContainer}>
        <Text style={styles.bioText}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed et
          ullamcorper nisi.
        </Text>
      </View> */}
      <View style={styles.statsContainer}>
        <View style={styles.statContainer}>
          <Text style={styles.statCount}>0</Text>
          <Text style={styles.statLabel}>Posts</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statCount}>0</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.statContainer}>
          <Text style={styles.statCount}>0</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.button} onPress={() => auth.signOut()}>
        <Text style={styles.buttonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    alignItems: "center",
  },
  coverPhoto: {
    width: "100%",
    height: 200,
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -50,
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  bioContainer: {
    padding: 15,
  },
  bioText: {
    fontSize: 16,
  },
  statsContainer: {
    flexDirection: "row",
    marginTop: 20,
    marginBottom: 20,
  },
  statContainer: {
    alignItems: "center",
    flex: 1,
  },
  statCount: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 16,
    color: "#999",
  },
  button: {
    backgroundColor: "red",
    borderRadius: 5,
    padding: 10,
    marginHorizontal: 20,
  },
  buttonText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
  },
};

export default Profile;
