import {
  StyleSheet,
  Text,
  Touchable,
  View,
  TextInput,
  Image,
  Dimensions,
} from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Map from "../components/Map";
import MapView, { Marker } from "react-native-maps";
import { TouchableOpacity } from "react-native";
import HomeList from "../components/HomeList";
import Ionicons from "@expo/vector-icons/Ionicons";
const { width } = Dimensions.get("window");
import * as Location from "expo-location";
import { collection, getDoc, getDocs } from "firebase/firestore";
import { database } from "../config/firebase";

const Home = () => {
  const [mapToggled, setMapToggled] = useState(true);
  const [toggleText, setToggleText] = useState("List");
  const [latitude, setLatitude] = useState();
  const [longitude, setLongitude] = useState();
  const [pickupGames, setPickupGames] = useState([]);
  const [previousNumber, setPreviousNumber] = useState();

  const toggle = () => {
    setMapToggled(!mapToggled);
    setToggleText(mapToggled ? "Map" : "List");
    fetchGames();
  };

  const [locationServicesEnabled, setlocationServicesEnabled] = useState(false);
  useEffect(() => {
    checkIfLocationEnabled();
    getCurrentLocation();
  }, []);
  const checkIfLocationEnabled = async () => {
    let enabled = await Location.hasServicesEnabledAsync();
    if (!enabled) {
      Alert.alert(
        "Location services not enabled",
        "Please enable the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    } else {
      setlocationServicesEnabled(enabled);
    }
  };
  const getCurrentLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission denied",
        "allow the app to use the location services",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => console.log("OK Pressed") },
        ],
        { cancelable: false }
      );
    }

    const { coords } = await Location.getCurrentPositionAsync();
    if (coords) {
      const { latitude, longitude } = coords;
      setLatitude(latitude);
      setLongitude(longitude);
    }
  };

  const fetchGames = async () => {
    const colRef = collection(database, "games");
    const docsSnap = await getDocs(colRef);
    let temp = [];
    docsSnap.forEach((doc) => {
      temp.push(doc.data());
      console.log(doc.data());
    });
    setPickupGames(temp);
  };

  useEffect(() => {
    setPreviousNumber(pickupGames.length);
    if (pickupGames.length == previousNumber) return;

    const fetchGames = async () => {
      const colRef = collection(database, "games");
      const docsSnap = await getDocs(colRef);
      let temp = [];
      docsSnap.forEach((doc) => {
        temp.push(doc.data());
        console.log(doc.data());
      });
      setPickupGames(temp);
      console.log(pickupGames);
    };
    fetchGames();
  }, [pickupGames]);

  return (
    <SafeAreaView>
      <View style={styles.input}>
        <Text style={styles.toggleBtn} onPress={toggle}>
          {toggleText}
        </Text>
        <TextInput
          style={{ flex: 1 }}
          placeholderTextColor="#696969"
          blurOnSubmit={false}
          placeholder="Search..."
          returnKeyType="send"
        />
        <TouchableOpacity style={{}}>
          <Ionicons name={"add-circle"} size={20} />
        </TouchableOpacity>
      </View>
      {longitude == undefined && latitude == undefined ? (
        <Text className="text-center font-bold relative text-xl top-16">
          Loading Map...
        </Text>
      ) : mapToggled ? (
        <View className="h-full">
          <MapView
            style={{ flex: 1 }}
            region={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            showsUserLocation={true}
          >
            {pickupGames.length > 0
              ? pickupGames.map((game) => (
                  <Marker
                    key={game.id}
                    coordinate={{
                      latitude: game.latitude,
                      longitude: game.longitude,
                    }}
                    description={game.address}
                    title={game.description}
                  >
                    <Image
                      source={require("../assets/location-pin.png")}
                      style={{ width: 30, height: 30 }}
                    />
                  </Marker>
                ))
              : null}
          </MapView>
        </View>
      ) : (
        <HomeList fetchGames={fetchGames} games={pickupGames} />
      )}
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  toggleBtn: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    marginRight: 16,
    color: "red",
    textAlign: "center",
    alignContent: "center",
  },
  input: {
    flexDirection: "row",
    alignSelf: "flex-end",
    padding: 10,
    height: 40,
    width: width - 20,
    backgroundColor: "#fff",
    margin: 10,
    shadowColor: "#3d3d3d",
    shadowRadius: 2,
    shadowOpacity: 0.5,
    shadowOffset: {
      height: 1,
    },
    borderRadius: 5,
  },
});
