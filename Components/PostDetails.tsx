import React, { FC, useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
    Alert,
} from "react-native";
import { Recipe } from "../Models/RecipeModel";
import UserModel, { User } from "../Models/UserModel";

const PostDetails: FC<{
    route: any;
    navigation: any;
}> = ({ route, navigation }) => {
    const { post, userId }: { post: Recipe; userId: string } = route.params;
    const isPostSaved = post.savedUsers.includes(userId);
    const isUsersPost = post.owner === userId;
    const [owner, setOwner] = useState<User | null>(null);

    useEffect(() => {
        const fetchOwnerDetails = async () => {
            try {
                const response: any = await UserModel.getUser({
                    userId: post.owner,
                });
                if (response.data) {
                    setOwner(response.data);
                }
            } catch (error) {
                console.log("Error fetching owner details:", error);
            }
        };

        fetchOwnerDetails();
    }, [post.owner]);

    const handleUnSave = async () => {
        const updatedSavedUsers = post.savedUsers.filter((id) => id != userId);
        const updatedPost: Recipe = {
            ...post,
            savedUsers: updatedSavedUsers,
        };
        await UserModel.savePost(updatedPost);
        navigation.goBack();
    };

    const handleSavePost = async () => {
        const updatedPost: Recipe = {
            ...post,
            savedUsers: [...post.savedUsers, userId],
        };
        await UserModel.savePost(updatedPost);
        navigation.goBack();
    };

    const handleEdit = async () => {
        await navigation.navigate("Edit Post", {
            post,
        });
    };

    const handleDelete = async () => {
        Alert.alert(
            "Confirm Delete",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Post deletion canceled"),
                    style: "cancel",
                },
                {
                    text: "OK",
                    onPress: async () => {
                        await UserModel.deletePost(post);
                        navigation.goBack();
                    },
                },
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                <Text style={styles.title}>{post.title}</Text>
                {owner && (
                    <>
                        <Text style={styles.owner}>By {owner.name}</Text>
                        <Image
                            source={{ uri: owner.image }}
                            style={styles.ownerImage}
                        />
                    </>
                )}
                <View style={styles.imageContainer}>
                    {Array.isArray(post.images) && post.images.length > 0 ? (
                        post.images.map((uri, index) => (
                            <Image
                                key={index}
                                source={{ uri }}
                                style={styles.image}
                            />
                        ))
                    ) : (
                        <Image
                            source={{
                                uri: "https://i.vimeocdn.com/portrait/58832_300x300.jpg",
                            }}
                            style={styles.image}
                        />
                    )}
                </View>
                <Text style={styles.descriptionHeader}>Description</Text>
                <Text style={styles.description}>{post.description}</Text>
                <Text style={styles.sectionTitle}>Ingredients:</Text>
                {Array.isArray(post.ingredients) &&
                post.ingredients.length > 0 ? (
                    post.ingredients.map((ingredient, index) => (
                        <Text key={index} style={styles.ingredient}>
                            {ingredient}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.ingredient}>
                        No ingredients available
                    </Text>
                )}
                <Text style={styles.sectionTitle}>Steps:</Text>
                {Array.isArray(post.steps) && post.steps.length > 0 ? (
                    post.steps.map((step, index) => (
                        <Text key={index} style={styles.step}>
                            {index + 1}. {step}
                        </Text>
                    ))
                ) : (
                    <Text style={styles.step}>No steps available</Text>
                )}
            </ScrollView>
            <View style={styles.buttonContainer}>
                {isUsersPost && (
                    <>
                        <Button title="Edit post" onPress={handleEdit} />
                        <Button title="Delete post" onPress={handleDelete} />
                    </>
                )}
                {!isUsersPost && (
                    <Button
                        title={isPostSaved ? "Unsave Post" : "Save Post"}
                        onPress={isPostSaved ? handleUnSave : handleSavePost}
                    />
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
        paddingBottom: 100, // Ensure content does not overlap with buttons
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    owner: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    ownerImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginBottom: 20,
    },
    imageContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        marginBottom: 20,
    },
    image: {
        width: 100,
        height: 100,
        marginRight: 10,
        marginBottom: 10,
    },
    descriptionHeader: {
        fontWeight: "bold",
        fontSize: 16,
        marginBottom: 20,
    },
    description: {
        fontSize: 16,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 10,
    },
    ingredient: {
        fontSize: 16,
        marginBottom: 5,
    },
    step: {
        fontSize: 16,
        marginBottom: 10,
    },
    buttonContainer: {
        position: "absolute",
        bottom: 0,
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#fff",
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: "#ccc",
    },
});

export default PostDetails;
