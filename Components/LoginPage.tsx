import React, { FC, useState, useEffect } from "react";
import * as SecureStorage from "../utilities/secureStorage";
import apiClient from "../api/client";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    Alert,
    TouchableOpacity,
} from "react-native";
import UserAPI from "../api/UserAPI";
import UserModel from "../Models/UserModel";

const LoginPage: FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await SecureStorage.getAccessToken();
                const userId = await SecureStorage.getUserId();
                console.log(userId);
                if (token) {
                    apiClient.setHeader("Authorization", `Bearer ${token}`);
                    navigation.navigate("HomePage", { userId: userId });
                }
            } catch (e) {
                console.error("Failed to load the token.");
            }
        };
        checkLoginStatus();
    }, []);
    const handleLogin = async () => {
        try {
            const response = await UserModel.login({ email, password });
            if (response.ok && response.data) {
                const { accessToken, refreshToken, name, userId, image, bio } =
                    response.data;
                // Save tokens or perform any necessary action
                navigation.navigate("HomePage", {
                    name,
                    userId,
                    refreshToken,
                    accessToken,
                    email,
                    image,
                    bio,
                });
            } else {
                Alert.alert("Login failed. Please try again.");
            }
        } catch (err) {
            console.error("Error during login process:", err);
            Alert.alert(
                "An error occurred. Please check your details and try again."
            );
        }
    };

    const navigateToRegistration = () => {
        navigation.navigate("RegistrationPage");
    };

    const handleForgotPassword = () => {
        // Handle forgot password logic
        Alert.alert(
            "Forgot Password",
            "Forgot Password functionality to be implemented."
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
            />
            <Button title="Login" onPress={handleLogin} />
            <View style={styles.smallButtonContainer}>
                <TouchableOpacity
                    onPress={navigateToRegistration}
                    style={styles.smallButton}
                >
                    <Text style={styles.smallButtonText}>Register</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={handleForgotPassword}
                    style={styles.smallButton}
                >
                    <Text style={styles.smallButtonText}>Forgot Password</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    smallButtonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 10,
    },
    smallButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: "#ccc",
    },
    smallButtonText: {
        fontSize: 16,
        color: "#007BFF",
    },
});

export default LoginPage;
