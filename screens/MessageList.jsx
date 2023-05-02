import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");

export default MessageList = ({ navigation }) => {
  const data = [
    {
      id: 1,
      image: "https://bootdey.com/img/Content/avatar/avatar1.png",
      name: "Frank Odalthh",
      message:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    },
    {
      id: 2,
      image: "https://bootdey.com/img/Content/avatar/avatar6.png",
      name: "John DoeLink",
      message:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    },
    {
      id: 3,
      image: "https://bootdey.com/img/Content/avatar/avatar7.png",
      name: "March SoulLaComa",
      message:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    },
    {
      id: 4,
      image: "https://bootdey.com/img/Content/avatar/avatar2.png",
      name: "Finn DoRemiFaso",
      message:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    },
    {
      id: 5,
      image: "https://bootdey.com/img/Content/avatar/avatar3.png",
      name: "Maria More More",
      message:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    },
    {
      id: 6,
      image: "https://bootdey.com/img/Content/avatar/avatar4.png",
      name: "Clark June Boom!",
      message:
        "Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    },
    {
      id: 7,
      image: "https://bootdey.com/img/Content/avatar/avatar5.png",
      name: "The googler",
      message:
        "Lorem ipsum Test dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    },
    {
      id: 8,
      image: "https://bootdey.com/img/Content/avatar/avatar7.png",
      name: "Osman",
      message:
        "Lorem ipsum Test dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.",
    },
  ];

  const filterMessages = (text) => {
    let input = text.toLowerCase();
    setMessages(
      data.filter((x) => {
        if (
          x.message.toLowerCase().includes(input) ||
          x.name.toLowerCase().includes(input)
        ) {
          return x;
        }
      })
    );
  };

  const [messages, setMessages] = useState(data);

  return (
    <SafeAreaView edges={["top"]}>
      <View style={styles.input}>
        <TextInput
          style={{ flex: 1 }}
          placeholderTextColor="#696969"
          onChangeText={(msg) => filterMessages(msg)}
          blurOnSubmit={false}
          placeholder="Search..."
          returnKeyType="send"
        />
        <TouchableOpacity style={{}}>
          <Ionicons name={"add-circle"} size={20} />
        </TouchableOpacity>
      </View>
      <FlatList
        style={styles.root}
        data={messages}
        extraData={this.state}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        keyExtractor={(item) => {
          return item.id;
        }}
        renderItem={(item) => {
          const Message = item.item;
          return (
            <TouchableOpacity
              style={styles.container}
              onPress={() => {
                navigation.navigate("Chat", { Message });
              }}
            >
              {/* TODO: Make into component and pass props */}
              <Image style={styles.image} source={{ uri: Message.image }} />
              <View style={styles.content}>
                <View style={styles.contentHeader}>
                  <Text style={styles.name}>{Message.name}</Text>
                  <Text style={styles.time}>9:58 am</Text>
                </View>
                <Text rkType="primary3 mediumLine">{Message.message}</Text>
              </View>
            </TouchableOpacity>
          );
        }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#ffffff",
    marginTop: 10,
  },
  container: {
    paddingLeft: 19,
    paddingRight: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "flex-start",
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },
  contentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: "#CCCCCC",
  },
  image: {
    width: 45,
    height: 45,
    borderRadius: 22,
    marginLeft: 20,
  },
  time: {
    fontSize: 11,
    color: "#808080",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
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
