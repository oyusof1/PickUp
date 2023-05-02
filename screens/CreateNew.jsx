import React, { useState, useEffect, useRef } from "react";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  StyleSheet,
  Text,
  TextInput,
  SafeAreaView,
  ScrollView,
  Pressable,
  LogBox,
  // TouchableOpacity,
} from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import DateTimePicker from "@react-native-community/datetimepicker";
import { database } from "../config/firebase";
import { auth } from "../config/firebase";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";
import uuid from "react-native-uuid";

const CreateNew = ({ navigation }) => {
  LogBox.ignoreLogs(["Virtualized"]);
  const [sport, setSport] = useState("");
  const [teamSize, setTeamSize] = useState(1);
  const [location, setLocation] = useState({});
  const [date, setSelectedDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [minDate, setMinDate] = useState(new Date());
  const [icon, setIcon] = useState();
  const [name, setName] = useState();
  const [id, setId] = useState();

  useEffect(() => {
    setMinDate(new Date());
    getUser(auth.currentUser.uid)
  }, []);

  const handleSportChange = (sport, i) => {
    setSport(sport);
  };

  const handleTeamSizeChange = (teamSize) => {
    setTeamSize(teamSize);
  };

  const handleLocationChange = (lat, lng, desc) => {
    setLocation({ lat: lat, lng: lng, desc: desc });
  };

  const handleDescriptionChange = (description) => {
    setDescription(description);
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "set") {
      setSelectedDate(selectedTime);
    }
  };

  const getId = () => {
    setId(uuid.v4())
  }

  const getUser = async (id) => {
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

  const sports = ["Basketball", "Soccer", "Volleyball", "Tennis"];

  const createNew = async () => {
    const tempId = getId();
    const obj = {
      date: date,
      description: description,
      latitude: location.lat,
      longitude: location.lng,
      address: location.desc,
      name: name,
      numAttendees: 0,
      numInterested: 0,
      sport: sport,
      teamSize: teamSize,
      id: id,
      user: auth.currentUser.uid,
      img: icon,
    };

    console.log(obj);
    await setDoc(doc(database, "games", `${id}`), obj, {
      merge: true,
    });

    navigation.navigate("Home");
  };

  return (
    <SafeAreaView className="flex-1 items-center justify-center p-4 bg-gray-100">
      <KeyboardAwareScrollView
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        overScrollMode="never"
        className="bg-white rounded-lg shadow-lg p-6 h-full w-full"
      >
        <Text className="text-gray-800 text-2xl text-center font-bold mb-6">
          Create Pickup Game
        </Text>
        <Text style={{ fontSize: 16, fontWeight: "500", marginHorizontal: 10 }}>
          Sport
        </Text>
        <ScrollView
          className="w-75"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {sports.map((item, i) => (
            <Pressable
              style={
                sport == item
                  ? {
                      margin: 10,
                      borderRadius: 7,
                      padding: 15,
                      borderColor: "red",
                      borderWidth: 0.7,
                    }
                  : {
                      margin: 10,
                      borderRadius: 7,
                      padding: 15,
                      borderColor: "gray",
                      borderWidth: 0.7,
                    }
              }
              onPress={() => handleSportChange(item, i)}
              key={i}
            >
              <Text>{item}</Text>
            </Pressable>
          ))}
        </ScrollView>
        <Text
          style={{
            marginTop: 20,
            marginBottom: 10,
            fontSize: 16,
            fontWeight: "500",
            marginHorizontal: 10,
          }}
        >
          Team Size
        </Text>
        <TextInput
          className="border border-gray-400 rounded-lg p-4 w-full"
          placeholder="Number of players per team...."
          value={teamSize}
          onChangeText={handleTeamSizeChange}
          keyboardType="numeric"
        />
        <Text
          style={{
            marginTop: 25,
            marginBottom: 10,
            fontSize: 16,
            fontWeight: "500",
            marginHorizontal: 10,
          }}
        >
          Address
        </Text>
        <ScrollView horizontalScroll={true} keyboardShouldPersistTaps="always">
          <GooglePlacesAutocomplete
            placeholder="Enter Address or Location...."
            onPress={(data, details = null) => {
              handleLocationChange(
                details.geometry.location.lat,
                details.geometry.location.lng,
                data.description
              );
            }}
            query={{
              key: "AIzaSyAPBjMim0alwFtEpo7VCSIU_Ja85PD1Nl0",
              language: "en",
              components: "country:us",
            }}
            enablePoweredByContainer={false}
            fetchDetails={true}
            nearbyPlacesAPI="GooglePlacesSearch"
            minLength={2}
          />
        </ScrollView>
        <Text
          style={{
            marginTop: 25,
            marginBottom: 10,
            fontSize: 16,
            fontWeight: "500",
            marginHorizontal: 10,
          }}
        >
          Description
        </Text>
        <TextInput
          className="border border-gray-400 rounded-lg p-4 w-full"
          placeholder="Game description..."
          value={description}
          onChangeText={handleDescriptionChange}
        />
        <Text
          style={{
            marginTop: 25,
            marginBottom: 10,
            fontSize: 16,
            fontWeight: "500",
            marginHorizontal: 10,
          }}
        >
          Date and Time
        </Text>
        <DateTimePicker
          minimumDate={minDate}
          value={date}
          mode={"datetime"}
          onChange={handleTimeChange}
          minuteInterval={5}
        />

        <Pressable
          className="bg-red-500 w-1/2 relative top-14 rounded-lg m-auto px-4 py-2"
          onPress={createNew}
        >
          <Text className="text-white text-center text-lg font-bold">
            Submit
          </Text>
        </Pressable>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({});

export default CreateNew;
