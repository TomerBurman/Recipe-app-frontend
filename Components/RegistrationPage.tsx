import React, { FC, useState, useEffect } from "react";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    Alert,
    Image,
    TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import UserModel from "../Models/UserModel";
import { ActivityIndicator } from "./ActivityIndicator";

const RegistrationPage: FC<{ navigation: any; route: any }> = ({
    navigation,
    route,
}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [image, setImage] = useState("");
    const [tokens, setTokens] = useState<Array<String>>([]);
    const [loading, setLoading] = useState(false);

    const askPermission = async () => {
        try {
            const res = await ImagePicker.getCameraPermissionsAsync();
            if (!res.granted) {
                Alert.alert("You need to adjust the permissions");
            }
        } catch (err) {
            console.log("ask permission error " + err);
        }
    };

    useEffect(() => {
        askPermission();
    }, []);

    const openCamera = async () => {
        try {
            const res = await ImagePicker.launchCameraAsync();
            if (!res.canceled && res.assets.length > 0) {
                setImage(res.assets[0].uri);
            }
        } catch (err) {
            console.log("ask permission error " + err);
        }
    };

    const openGallery = async () => {
        try {
            const res = await ImagePicker.launchImageLibraryAsync();
            if (!res.canceled && res.assets.length > 0) {
                setImage(res.assets[0].uri);
            }
        } catch (err) {
            console.log("ask permission error " + err);
        }
    };

    const validateEmail = (email: string) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    const validatePassword = (password: string) => {
        return password.length >= 8;
    };

    const handleRegister = async () => {
        if (!validateEmail(email)) {
            Alert.alert("Invalid email format");
            return;
        }
        if (!validatePassword(password)) {
            Alert.alert("Password must be at least 8 characters long");
            return;
        }

        setLoading(true);
        try {
            if (image != "") {
                const url = await UserModel.uploadImage(image);
                setImage(url);
                const res = await UserModel.register({
                    email,
                    password,
                    name,
                    bio,
                    image: url,
                });
                if (res && res.status == 200) {
                    try {
                        const res2 = await UserModel.login({ email, password });
                        if (res2.ok && res2.data) {
                            const { accessToken, refreshToken, name, userId } =
                                res2.data;
                            setTokens([accessToken, refreshToken]);
                            navigation.navigate("HomePage", {
                                name,
                                userId,
                                bio,
                                email,
                                accessToken: res2.data.accessToken,
                                refreshToken: res2.data.refreshToken,
                                image: image,
                            });
                        }
                    } catch (err) {
                        Alert.alert("Error logging in");
                    }
                } else {
                    Alert.alert("Error registering, please try again");
                }
            }
        } catch (err) {
            Alert.alert("Error registering, make sure all fields are valid");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator visible={loading} />}
            {!loading && (
                <>
                    <View>
                        {image == "" && (
                            <Image
                                source={require("../assets/icon.png")}
                                style={styles.image}
                            />
                        )}
                        {image != "" && (
                            <Image
                                source={{ uri: image }}
                                style={styles.image}
                            />
                        )}
                        <TouchableOpacity onPress={openCamera}>
                            <AntDesign
                                name="camera"
                                size={24}
                                color="black"
                                style={styles.addImageIcon}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={openGallery}>
                            <AntDesign
                                name="picture"
                                size={24}
                                color="black"
                                style={styles.galleryIcon}
                            />
                        </TouchableOpacity>
                    </View>
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
                </>
            )}
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
    image: {
        width: 300,
        height: 300,
        margin: 5,
        borderRadius: 150,
        resizeMode: "cover",
        alignSelf: "center",
    },
    addImageIcon: {
        position: "absolute",
        bottom: -10,
        left: 50,
        width: 60,
        height: 60,
    },
    galleryIcon: {
        position: "absolute",
        bottom: -10,
        right: 10,
        width: 60,
        height: 60,
    },
});

export default RegistrationPage;
