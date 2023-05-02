import React from "react";
import {
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { auth, database } from "../config/firebase";
import { useState } from "react";
import { collection, doc, updateDoc, increment } from "firebase/firestore";

const HomeList = ({ games, fetchGames }) => {
  const [isAttending, setIsAttending] = useState(false);

  const handleAttendance = async (id) => {
    const docRef = doc(database, "games", id);
    try {
      await updateDoc(docRef, {
        numAttendees: increment(1),
      });
      console.log("Attendance updated successfully");
      fetchGames();
    } catch (error) {
      console.error("Error updating attendance:", error);
    }
  };

  return (
    <FlatList
      data={games}
      renderItem={({ item }) => (
        <View style={styles.post}>
          <View style={styles.header}>
            <Image source={{ uri: item.img }} style={styles.avatar} />
            <View>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.date}>
                {new Date(item.date.seconds * 1000).toLocaleString("en-US", {
                  timeZone: "America/New_York",
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </Text>
            </View>
            <View>
              <Text style={[styles.name, { textAlign: "right" }]}>
                {item.sport}
              </Text>
              <Text style={styles.sideText}>
                {"Team Size: " + item.teamSize}
              </Text>
            </View>
          </View>
          <Text style={styles.description}>
            {"Located at: " + item.address}
          </Text>
          <Text style={styles.description}>{item.description}</Text>
          {item.image && (
            <Image
              source={{ uri: item.image }}
              style={{ height: 200, width: "100%" }}
            />
          )}
          <View style={styles.actions}>
            <Text style={styles.actionCount}>
              {item.numAttendees + " Going"}
            </Text>
            <Text> </Text>
            <TouchableOpacity
              onPress={() => {
                handleAttendance(item.id);
              }}
              style={styles.actionButton}
            >
              <Text style={[styles.actionText, {}]}>
                {isAttending ? "Not Going" : "Attend"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  post: {
    marginHorizontal: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    marginBottom: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: "#808080",
    padding: 10,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
  date: {
    fontSize: 14,
    color: "gray",
    marginLeft: 10,
  },
  description: {
    marginBottom: 10,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    fontSize: 18,
    color: "red",
  },
  actionCount: {
    fontSize: 18,
    marginLeft: 5,
  },
  sideText: {
    fontSize: 14,
    color: "gray",
    marginLeft: 90,
    textAlign: "right",
  },
});

export default HomeList;
