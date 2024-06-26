import React, { FC, useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    Button,
} from "react-native";
import { User, setUser, getAllPosts } from "../Models/UserModel";
import { Recipe } from "../Models/RecipeModel";
import RecipeList from "./RecipeList";

const HomePage: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [posts, setPosts] = useState<Recipe[] | null>(null);
    const [data, setData] = useState<User | null>(null);
    const [selectedTab, setSelectedTab] = useState<string>("Explore");
    const { name, userId, refreshToken, accessToken, email } = route.params;
    useEffect(() => {
        const initializeData = () => {
            const userData = setUser({
                name,
                userId,
                refreshToken,
                accessToken,
                email,
            });
            setData(userData);
        };

        initializeData();
    }, [name, userId, refreshToken, accessToken, email]);

    useEffect(() => {
        const fetchPosts = async () => {
            if (data) {
                try {
                    const postsData: Recipe[] = await getAllPosts({
                        refreshToken: data.tokens[1],
                        accessToken: data.tokens[0],
                    });
                    setPosts(postsData);
                } catch (error) {
                    console.log("Error fetching posts: ", error);
                }
            }
        };
        navigation.setOptions({
            headerRight: () => (
                <Button
                    onPress={() => {
                        navigation.navigate("New post", {
                            userId: data?.userId,
                            accessToken: data?.tokens[0],
                        });
                    }}
                    title="Post recipe"
                />
            ),
        });
        fetchPosts();
    }, [data]);

    if (!data || !posts) {
        return <Text>Loading...</Text>;
    }

    const renderContent = () => {
        if (selectedTab === "Explore") {
            return (
                <RecipeList
                    route={route}
                    navigation={navigation}
                    data={posts}
                />
            );
        } else {
            return <Text>Here are the liked recipes...</Text>; // Replace with actual Liked Recipes component or content
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.navigate("Profile", { user: data })}
            >
                <Image
                    source={require("../assets/icon.png")}
                    style={styles.profileImage}
                />
            </TouchableOpacity>
            <Text style={styles.welcomeMessage}>Welcome, {data.name}!</Text>
            <View style={styles.buttonContainer}>
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedTab === "Explore" && styles.selectedButton,
                    ]}
                    onPress={() => setSelectedTab("Explore")}
                >
                    <Text style={styles.buttonText}>Explore</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedTab === "LikedRecipes" && styles.selectedButton,
                    ]}
                    onPress={() => setSelectedTab("LikedRecipes")}
                >
                    <Text style={styles.buttonText}>Liked Recipes</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.contentContainer}>{renderContent()}</View>
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
    welcomeMessage: {
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
        textAlign: "center",
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 5,
        marginHorizontal: 10,
        flex: 1,
        alignItems: "center",
    },
    selectedButton: {
        backgroundColor: "#0056b3",
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 16,
        fontWeight: "bold",
    },
    contentContainer: {
        flex: 1,
        width: "100%",
        justifyContent: "center",
    },
});

export default HomePage;
