import React, { FC, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import UserAPI from "../api/UserAPI";
import { User } from "../Models/UserModel";

const RegistrationPage: FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [tokens, setTokens] = useState<Array<String>>([]);

    const handleRegister = async () => {
        try {
            const res = await UserAPI.register({ email, password, name, bio });
            console.log(res);
            if (res && res.status == 200) {
                try {
                    const res2 = await UserAPI.login({ email, password });
                    if (res2.ok && res2.data) {
                        const { accessToken, refreshToken } = res2.data;
                        setTokens([accessToken, refreshToken]);
                        navigation.navigate("HomePage");
                    }
                } catch (err) {
                    Alert.alert("Error logging in");
                }
            } else {
                Alert.alert("Error registering, please try again");
            }
        } catch (err) {
            Alert.alert("Error registering, make sure all fields are valid");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            <TextInput
                style={styles.input}
                placeholder="Name"
                value={name}
                onChangeText={setName}
            />
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
            <TextInput
                style={styles.input}
                placeholder="Bio"
                value={bio}
                onChangeText={setBio}
            />
            <Button title="Register" onPress={handleRegister} />
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
});

export default RegistrationPage;
