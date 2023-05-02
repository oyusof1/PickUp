import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import React, { useState, createContext, useContext, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase";
import Login from "./screens/Login";
import Signup from "./screens/Signup";
import Home from "./screens/Home";
import Profile from "./screens/Profile";
import Notifications from "./screens/Notifications";
import Ionicons from "@expo/vector-icons/Ionicons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MessageList from "./screens/MessageList";
import Chat from "./screens/Chat";
import CreateNew from "./screens/CreateNew";
import { LogBox } from 'react-native';
LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs()

const AuthenticatedUserContext = createContext({ user: null, setUser: null });

const AuthenticatedUserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  return (
    <AuthenticatedUserContext.Provider value={{ user, setUser }}>
      {children}
    </AuthenticatedUserContext.Provider>
  );
};

const AuthStack = createNativeStackNavigator();
function AuthStackScreen() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={Login} />
      <AuthStack.Screen name="Signup" component={Signup} />
      <AuthStack.Screen name="Home" component={Home} />
      <AuthStack.Screen
        name="CreateNew"
        component={CreateNew}
        options={{ animation: "slide_from_bottom" }}
      />
    </AuthStack.Navigator>
  );
}

const MessageStack = createNativeStackNavigator();
function MessageStackScreen() {
  return (
    <MessageStack.Navigator screenOptions={{ headerShown: false}}>
      <MessageStack.Screen name="MessageList" component={MessageList} />
      <MessageStack.Screen name="Chat" component={Chat} />
      <MessageStack.Screen name="Profile" component={Profile} />
    </MessageStack.Navigator>
  );
}

const CreateNewPlaceholder = () => (
  <View style={{ flex: 1, backgroundColor: "blue" }} />
);

const Tab = createBottomTabNavigator();
function TabStack() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          }
          if (route.name === "Messages") {
            iconName = focused ? "chatbox" : "chatbox-outline";
          }
          if (route.name === "+") {
            iconName = "add-circle";
            size = 50;
          }
          if (route.name === "Notifications") {
            iconName = focused ? "notifications" : "notifications-outline";
          }
          if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "red",
        tabBarInactiveTintColor: "black",
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Messages" component={MessageStackScreen} />
      <Tab.Screen
        name="Create"
        component={CreateNewPlaceholder}
        options={{
          tabBarIcon: (props) => (
            <Ionicons name="ios-add" size={props.size} color={props.color} />
          ),
        }}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("CreateNew");
          },
        })}
      />
      <Tab.Screen name="Notifications" component={Notifications} />
      <Tab.Screen name="Profile" component={Profile} />
    </Tab.Navigator>
  );
}

const RootStack = createNativeStackNavigator();
function RootNavigator() {
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const unsubscribeAuth = onAuthStateChanged(
      auth,
      async (authenticatedUser) => {
        authenticatedUser ? setUser(authenticatedUser) : setUser(null);
        setIsLoading(false);
      }
    );
    // unsubscribe auth listener on unmount
    return unsubscribeAuth;
  }, [user]);
  if (isLoading) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      ></View>
    );
  }
  return (
    <RootStack.Navigator
      screenOptions={{ headerShown: false, presentation: "modal" }}
    >
      {user ? (
        <RootStack.Screen name="HomeStackScreen" component={TabStack} />
      ) : (
        <RootStack.Screen name="AuthStackScreen" component={AuthStackScreen} />
      )}
      <RootStack.Screen
        name="CreateNew"
        component={CreateNew}
        options={{ animation: "slide_from_bottom" }}
      />
    </RootStack.Navigator>
  );
}

export default function App() {
  return (
    <AuthenticatedUserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </AuthenticatedUserProvider>
  );
}
