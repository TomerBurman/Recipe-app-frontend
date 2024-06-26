import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    StatusBar,
} from "react-native";
import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfilePage from "./Components/ProfilePage";
import RegistrationPage from "./Components/RegistrationPage";
import HomePage from "./Components/HomePage";
import LoginPage from "./Components/LoginPage";
import CreatePost from "./Components/CreatePost";

const Stack = createNativeStackNavigator();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="HomePage" component={HomePage} />
                <Stack.Screen name="Profile" component={ProfilePage} />
                <Stack.Screen name="New post" component={CreatePost} />

                <Stack.Screen
                    name="RegistrationPage"
                    component={RegistrationPage}
                />
            </Stack.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        marginTop: StatusBar.currentHeight,
        flex: 1,
        flexDirection: "column",
        backgroundColor: "#fff",
    },
});
