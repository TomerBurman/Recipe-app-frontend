import React, { FC, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
    Modal,
    Button,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import UserModel, { User } from "../Models/UserModel";

const ProfilePage: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [editField, setEditField] = useState<string | null>(null);
    const [tempUser, setTempUser] = useState<Partial<User>>({});
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [currentPassword, setCurrentPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const fetchData = () => {
            const user = route.params.user;
            setUser(user);
        };
        fetchData();
    }, []);

    const handleEditField = (field: keyof User) => {
        setEditField(field);
        setTempUser({ ...tempUser, [field]: user ? user[field] : "" });
    };

    const handleSaveField = async (field: keyof User) => {
        if (!user) return;

        const updatedUser = { ...user, [field]: tempUser[field] };
        setUser(updatedUser);
        setEditField(null);
        const res = await UserModel.updateUser(updatedUser);
        console.log(res.data);
        Alert.alert("Update", `${field} updated successfully.`);
        navigation.navigate("HomePage", { updatedUser });
    };

    const handlePickImage = async () => {
        const { status } =
            await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
            Alert.alert(
                "Permission Denied",
                "Sorry, we need camera roll permissions to make this work!"
            );
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (
            !result.canceled &&
            result.assets &&
            result.assets.length > 0 &&
            user
        ) {
            try {
                console.log(result.assets[0].uri, "This is the uri");
                const image = await UserModel.uploadImage(result.assets[0].uri);
                if (image) {
                    const updatedUser = { ...user, image: image };
                    setUser(updatedUser);
                    setTempUser({ ...tempUser, image: image });
                    await UserModel.updateUser(updatedUser);
                    navigation.navigate("HomePage", { updatedUser });
                    // Implement logic to save updated image
                    // await saveUser(updatedUser);
                    Alert.alert(
                        "Update",
                        `Profile image updated successfully.`
                    );
                } else {
                    Alert.alert("There was a network error. Please try again");
                }
            } catch (err: any) {
                Alert.alert(err.message);
            }
        }
    };

    const handleChangePassword = async () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }
        if (user) {
            await UserModel.updatePassword(user, password);
        }
        // Implement logic to change the password
        // Example: Update data source or API call
        // await changePassword(user.email, currentPassword, password);
        setPassword("");
        setConfirmPassword("");
        setCurrentPassword("");
        setModalVisible(false);
        Alert.alert("Update", "Password updated successfully.");
    };

    if (!user) {
        return <Text>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            {/* Profile Image */}
            <TouchableOpacity onPress={handlePickImage}>
                {user.image ? (
                    <Image
                        source={{ uri: user.image }}
                        style={styles.profileImage}
                    />
                ) : (
                    <Image
                        source={require("../assets/icon.png")}
                        style={styles.profileImage}
                    />
                )}
            </TouchableOpacity>

            {/* Name */}
            {editField === "name" ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={styles.input}
                        value={tempUser.name || ""}
                        onChangeText={(text) =>
                            setTempUser({ ...tempUser, name: text })
                        }
                    />
                    <TouchableOpacity onPress={() => handleSaveField("name")}>
                        <Text style={styles.saveButton}>Save</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => handleEditField("name")}>
                    <Text style={styles.name}>{user.name}</Text>
                </TouchableOpacity>
            )}

            {/* Email */}
            {editField === "email" ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={styles.input}
                        value={tempUser.email || ""}
                        onChangeText={(text) =>
                            setTempUser({ ...tempUser, email: text })
                        }
                    />
                    <TouchableOpacity onPress={() => handleSaveField("email")}>
                        <Text style={styles.saveButton}>Save</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => handleEditField("email")}>
                    <Text style={styles.email}>{user.email}</Text>
                </TouchableOpacity>
            )}

            {/* Bio */}
            {editField === "bio" ? (
                <View style={styles.editContainer}>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        value={tempUser.bio || ""}
                        onChangeText={(text) =>
                            setTempUser({ ...tempUser, bio: text })
                        }
                        multiline
                    />
                    <TouchableOpacity onPress={() => handleSaveField("bio")}>
                        <Text style={styles.saveButton}>Save</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <TouchableOpacity onPress={() => handleEditField("bio")}>
                    <Text style={styles.bio}>{user.bio}</Text>
                </TouchableOpacity>
            )}

            {/* Change Password */}
            <TouchableOpacity onPress={() => setModalVisible(true)}>
                <Text style={styles.changePasswordText}>Change Password</Text>
            </TouchableOpacity>

            {/* Modal for changing password */}
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalTitle}>Change Password</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Current Password"
                            secureTextEntry
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="New Password"
                            secureTextEntry
                            value={password}
                            onChangeText={setPassword}
                        />
                        <TextInput
                            style={styles.modalInput}
                            placeholder="Confirm New Password"
                            secureTextEntry
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                        />
                        <TouchableOpacity
                            style={styles.saveButtonContainer}
                            onPress={handleChangePassword}
                        >
                            <Text style={styles.saveButtonText}>
                                Save Password
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[
                                styles.saveButtonContainer,
                                styles.cancelButtonContainer,
                            ]}
                            onPress={() => setModalVisible(false)}
                        >
                            <Text style={styles.saveButtonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        padding: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    email: {
        fontSize: 18,
        color: "gray",
        marginBottom: 10,
    },
    bio: {
        fontSize: 16,
        marginTop: 10,
        textAlign: "center",
    },
    editContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 10,
    },
    input: {
        flex: 1,
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        marginRight: 10,
    },
    bioInput: {
        height: 80,
        textAlignVertical: "top",
    },
    saveButton: {
        color: "blue",
        fontSize: 18,
    },
    changePasswordText: {
        color: "blue",
        fontSize: 18,
        marginTop: 20,
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalView: {
        width: "80%",
        backgroundColor: "white",
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 20,
    },
    modalInput: {
        width: "100%",
        height: 40,
        borderColor: "gray",
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
    },
    saveButtonContainer: {
        backgroundColor: "blue",
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
        width: "100%",
        alignItems: "center",
    },
    saveButtonText: {
        color: "white",
        fontSize: 16,
    },
    cancelButtonContainer: {
        backgroundColor: "red",
        marginTop: 10,
    },
});

export default ProfilePage;
