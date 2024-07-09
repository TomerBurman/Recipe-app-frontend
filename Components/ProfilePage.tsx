import React, { FC, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { User } from "../Models/UserModel";

const ProfilePage: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [user, setUser] = useState<User | null>(null);
    const [editField, setEditField] = useState<string | null>(null);
    const [tempUser, setTempUser] = useState<Partial<User>>({});
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

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

        // Implement logic to save updated field
        // Example: Update data source or API call
        // await saveUser(updatedUser);
        Alert.alert("Update", `${field} updated successfully.`);
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
            const updatedUser = { ...user, image: result.assets[0].uri };
            setUser(updatedUser);
            setTempUser({ ...tempUser, image: result.assets[0].uri });

            // Implement logic to save updated image
            // await saveUser(updatedUser);
            Alert.alert("Update", `Profile image updated successfully.`);
        }
    };

    const handleChangePassword = () => {
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");
            return;
        }

        // Implement logic to change the password
        // Example: Update data source or API call
        // await changePassword(user.email, password);
        setPassword("");
        setConfirmPassword("");
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
            <Text style={styles.sectionTitle}>Change Password</Text>
            <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <TextInput
                style={styles.input}
                placeholder="Confirm New Password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={handleChangePassword}>
                <Text style={styles.saveButton}>Save Password</Text>
            </TouchableOpacity>
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
    sectionTitle: {
        fontSize: 20,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
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
});

export default ProfilePage;
