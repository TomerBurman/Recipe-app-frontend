// App.tsx
import React, { useState, useEffect } from "react";
import { StyleSheet, StatusBar, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfilePage from "./Components/ProfilePage";
import RegistrationPage from "./Components/RegistrationPage";
import HomePage from "./Components/HomePage";
import LoginPage from "./Components/LoginPage";
import CreatePost from "./Components/CreatePost";
import PostDetails from "./Components/PostDetails";
import EditPost from "./Components/EditPost";
import SplashScreen from "./Components/splashScreen";

const Stack = createNativeStackNavigator();

export default function App() {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate a loading process (e.g., fetching resources, initializing app)
        setTimeout(() => {
            setIsLoading(false);
        }, 3000); // Adjust the timeout duration as needed
    }, []);

    if (isLoading) {
        return <SplashScreen />;
    }

    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="LoginPage" component={LoginPage} />
                <Stack.Screen name="HomePage" component={HomePage} />
                <Stack.Screen name="Profile" component={ProfilePage} />
                <Stack.Screen name="New post" component={CreatePost} />
                <Stack.Screen name="Post Details" component={PostDetails} />
                <Stack.Screen name="Edit Post" component={EditPost} />
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
