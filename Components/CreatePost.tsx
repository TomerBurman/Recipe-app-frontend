import React, { FC, useState, useEffect } from "react";
import {
    View,
    TextInput,
    Button,
    StyleSheet,
    Text,
    Alert,
    Image,
    ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import UserModel, { User } from "../Models/UserModel"; // Import uploadImage

const CreatePost: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState("");
    const [images, setImages] = useState<string[]>([]);
    const user: User = route.params.user;

    const askPermission = async () => {
        try {
            const res = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (!res.granted) {
                alert("You need to accept camera roll permissions");
            }
        } catch (err) {
            console.log("Permission error: " + err);
        }
    };

    useEffect(() => {
        askPermission();
    }, []);

    const pickImage = async () => {
        if (images.length >= 3) {
            Alert.alert("You can only upload up to 3 images.");
            return;
        }

        try {
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const newImages = result.assets.map((asset) => asset.uri);
                setImages((prevImages) => [
                    ...prevImages,
                    ...newImages.slice(0, 3 - prevImages.length), // Limit to 3 images
                ]);
            } else {
                Alert.alert("You need to adjust permissions");
            }
        } catch (err) {
            console.error("Image picking error: ", err);
        }
    };

    const handleCreatePost = async () => {
        const uploadedImages = await Promise.all(
            images.map(async (imageURI) => {
                const url = await UserModel.uploadImage(imageURI);
                return url;
            })
        );

        const post = {
            title,
            ingredients: ingredients
                .split(",")
                .map((ingredient) => ingredient.trim()), // Convert comma-separated string to array
            description,
            steps: steps.split(".").map((step) => step.trim()), // Convert period-separated string to array
            images: uploadedImages, // Use the uploaded images array
            ownerName: user.name,
        };

        try {
            const res = await UserModel.createPost(user, post);
            if (res && res.status === 201) {
                Alert.alert("Post created successfully");
                navigation.goBack(); // Navigate back to the previous screen
            } else {
                Alert.alert("Error creating post, please try again");
            }
        } catch (err) {
            console.error(err);
            Alert.alert("Error creating post, make sure all fields are valid");
        }
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Create a New Recipe</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={title}
                onChangeText={setTitle}
            />
            <TextInput
                style={styles.input}
                placeholder="Ingredients (comma separated)"
                value={ingredients}
                onChangeText={setIngredients}
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={description}
                onChangeText={setDescription}
            />
            <TextInput
                style={styles.input}
                placeholder="Steps (period separated)"
                value={steps}
                onChangeText={setSteps}
            />
            <Button title="Pick images from camera roll" onPress={pickImage} />
            <View style={styles.imageContainer}>
                {images.map((uri, index) => (
                    <Image key={index} source={{ uri }} style={styles.image} />
                ))}
            </View>
            <Button title="Create Post" onPress={handleCreatePost} />
        </ScrollView>
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
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginVertical: 10,
    },
    image: {
        width: 100,
        height: 100,
        margin: 5,
        borderRadius: 10,
    },
});

export default CreatePost;
