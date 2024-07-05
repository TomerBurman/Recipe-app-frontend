import React, { FC } from "react";
import {
    View,
    Text,
    Image,
    Button,
    StyleSheet,
    ScrollView,
} from "react-native";
import { Recipe } from "../Models/RecipeModel";
import { savePost } from "../Models/UserModel";

const PostDetails: FC<{
    route: any;
    navigation: any;
}> = ({ route, navigation }) => {
    const { post, userId }: { post: Recipe; userId: string } = route.params;
    const isPostSaved = post.savedUsers.includes(userId);

    const handleDeletePost = async () => {
        const updatedSavedUsers = post.savedUsers.filter((id) => id != userId);
        const updatedPost: Recipe = {
            ...post,
            savedUsers: updatedSavedUsers,
        };
        const res = await savePost(updatedPost);
        navigation.goBack();
    };
    const handleSavePost = async () => {
        const updatedPost: Recipe = {
            ...post,
            savedUsers: [...post.savedUsers, userId],
        };
        const res = await savePost(updatedPost);
        navigation.goBack();
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>{post.title}</Text>
            <Text style={styles.owner}>By {post.ownerName}</Text>
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
            {Array.isArray(post.ingredients) && post.ingredients.length > 0 ? (
                post.ingredients.map((ingredient, index) => (
                    <Text key={index} style={styles.ingredient}>
                        {ingredient}
                    </Text>
                ))
            ) : (
                <Text style={styles.ingredient}>No ingredients available</Text>
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
            <Button
                title={isPostSaved ? "Unsave Post" : "Save Post"}
                onPress={isPostSaved ? handleDeletePost : handleSavePost}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    owner: {
        fontSize: 18,
        fontWeight: "bold",
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
});

export default PostDetails;
