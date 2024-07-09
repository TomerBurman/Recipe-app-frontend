import React, { FC, useState } from "react";
import {
    View,
    Text,
    Image,
    Button,
    TextInput,
    StyleSheet,
    ScrollView,
    Alert,
    TouchableOpacity,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Recipe } from "../Models/RecipeModel";
import UserModel from "../Models/UserModel";

const EditPost: FC<{
    route: any;
    navigation: any;
}> = ({ route, navigation }) => {
    const { post }: { post: Recipe } = route.params;
    const [editedPost, setEditedPost] = useState<Recipe>(post);
    const [images, setImages] = useState(post.images || []);

    const handleSaveChanges = async () => {
        const updatedPost: Recipe = {
            ...editedPost,
            images,
        };
        const res = await UserModel.savePost(updatedPost);
        if (res && res.status === 200) {
            Alert.alert("Post updated successfully");
            navigation.pop();
            navigation.goBack();
        } else {
            Alert.alert("Failed to update post. Please try again later.");
        }
    };

    const handlePickImage = async (index?: number) => {
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

        if (!result.canceled && result.assets && result.assets.length > 0) {
            let newImages = [...images];
            if (index !== undefined) {
                newImages[index] = await UserModel.uploadImage(
                    result.assets[0].uri
                );
            } else {
                const imageUri = await UserModel.uploadImage(
                    result.assets[0].uri
                );
                newImages = [...images, imageUri];
            }
            setImages(newImages);
        }
    };

    const handleRemoveImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index);
        setImages(newImages);
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Edit Post</Text>
            <TextInput
                style={styles.input}
                placeholder="Title"
                value={editedPost.title}
                onChangeText={(text) =>
                    setEditedPost({ ...editedPost, title: text })
                }
            />
            <TextInput
                style={styles.input}
                placeholder="Description"
                value={editedPost.description}
                onChangeText={(text) =>
                    setEditedPost({ ...editedPost, description: text })
                }
            />
            <TextInput
                style={styles.input}
                placeholder="Ingredients (comma-separated)"
                value={editedPost.ingredients.join(", ")}
                onChangeText={(text) =>
                    setEditedPost({
                        ...editedPost,
                        ingredients: text.split(", "),
                    })
                }
            />
            <TextInput
                style={styles.input}
                placeholder="Steps (one per line)"
                value={editedPost.steps.join(". ")}
                onChangeText={(text) =>
                    setEditedPost({ ...editedPost, steps: text.split(". ") })
                }
            />
            <View style={styles.imageContainer}>
                {images.map((uri, index) => (
                    <View key={index} style={styles.imageWrapper}>
                        <Image source={{ uri }} style={styles.image} />
                        <Button
                            title="Remove"
                            onPress={() => handleRemoveImage(index)}
                        />
                        <Button
                            title="Edit"
                            onPress={() => handlePickImage(index)}
                        />
                    </View>
                ))}
                {images.length < 3 && (
                    <TouchableOpacity
                        style={styles.addImageButton}
                        onPress={() => handlePickImage()}
                    >
                        <Text style={styles.addImageButtonText}>Add Image</Text>
                    </TouchableOpacity>
                )}
            </View>
            <Button title="Save Changes" onPress={handleSaveChanges} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        textAlign: "center",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        padding: 10,
        marginBottom: 20,
        borderRadius: 5,
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    imageWrapper: {
        position: "relative",
        marginRight: 10,
        marginBottom: 10,
    },
    image: {
        width: 100,
        height: 100,
    },
    addImageButton: {
        width: 100,
        height: 100,
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        marginRight: 10,
        marginBottom: 10,
    },
    addImageButtonText: {
        textAlign: "center",
        color: "#000",
    },
});

export default EditPost;
