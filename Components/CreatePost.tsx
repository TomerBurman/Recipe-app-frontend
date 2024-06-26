import React, { FC, useState } from "react";
import { View, TextInput, Button, StyleSheet, Text, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import UserAPI from "../api/UserAPI"; // Make sure to implement the appropriate API call in your UserAPI

const CreatePost: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [title, setTitle] = useState("");
    const [ingredients, setIngredients] = useState("");
    const [description, setDescription] = useState("");
    const [steps, setSteps] = useState("");
    const [imgUrl, setImgUrl] = useState("https://localhost:300");
    const user = route.params;

    const handleCreatePost = async () => {
        const post = {
            title,
            ingredients: ingredients
                .split(",")
                .map((ingredient) => ingredient.trim()), // Convert comma-separated string to array
            description,
            steps: steps.split(".").map((step) => step.trim()), // Convert period-separated string to array
        };

        try {
            const res = await UserAPI.createPost(user, post);
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
        <View style={styles.container}>
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
            <Button title="Create Post" onPress={handleCreatePost} />
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

export default CreatePost;
