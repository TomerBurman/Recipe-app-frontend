import React, { FC, useEffect, useState, useCallback } from "react";
import {
    StyleSheet,
    Text,
    Image,
    View,
    TouchableOpacity,
    Button,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import UserModel, { User } from "../Models/UserModel";
import { Recipe } from "../Models/RecipeModel";
import RecipeList from "./RecipeList";
import * as SecureStorage from "../utilities/secureStorage";
import { ActivityIndicator } from "./ActivityIndicator";

const HomePage: FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const [posts, setPosts] = useState<Recipe[] | null>(null);
    const [regularPosts, setRegularPosts] = useState<Recipe[] | null>(null);
    const [savedPosts, setSavedPosts] = useState<Recipe[] | null>(null);
    const [myPosts, setMyPosts] = useState<Recipe[] | null>(null);
    const [data, setData] = useState<User | null>(null);
    const [userId, setUserId] = useState("");
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState<string>("Explore");

    const { name, refreshToken, accessToken, email, image } = route.params;

    const getUserId = useCallback(async () => {
        setUserId(await SecureStorage.getUserId());
        if (userId) {
            try {
                const response: any = await UserModel.getUser({ userId });
                const user = response.data;
                setData(user);
            } catch (e) {
                console.log("There was an error getting users details", e);
            }
        }
    }, [userId]); // if userId changes, useEffect will run again

    useEffect(() => {
        const initializeData = () => {
            const userData = UserModel.setUser({
                name,
                userId,
                refreshToken,
                accessToken,
                email,
                image,
            });
            setData(userData);
            setLoading(false);
        };
        if (name && userId && refreshToken && accessToken && image && email) {
            initializeData();
        } else {
            getUserId();
        }
    }, [name, userId, refreshToken, accessToken, email, image, getUserId]);

    const fetchPosts = useCallback(async () => {
        if (data?.tokens) {
            try {
                const postsData: Recipe[] = await UserModel.getAllPosts({
                    refreshToken: data.tokens[1],
                    accessToken: data.tokens[0],
                });
                setPosts(postsData);
                const filteredSavedPosts = postsData.filter((post) =>
                    post.savedUsers.some((user) => user === data._id)
                );

                const filteredMyPosts = postsData.filter(
                    (post) => post.owner === data._id
                );
                const filteredRegularPosts = postsData.filter(
                    (post) =>
                        !filteredSavedPosts.includes(post) &&
                        !filteredMyPosts.includes(post)
                );
                setMyPosts(filteredMyPosts);
                setRegularPosts(filteredRegularPosts);
                setSavedPosts(filteredSavedPosts);
            } catch (error) {
                console.log("Error fetching posts: ", error);
            }
        }
    }, [data]);

    useFocusEffect(
        useCallback(() => {
            fetchPosts();
        }, [fetchPosts])
    );

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => (
                <View style={styles.headerLeftContainer}>
                    <TouchableOpacity
                        onPress={() =>
                            navigation.navigate("Profile", { user: data })
                        }
                    >
                        {data?.image && (
                            <Image
                                source={{ uri: data.image }}
                                style={styles.navProfileImage}
                            />
                        )}
                        {!data?.image && (
                            <Image
                                source={require("../assets/icon.png")}
                                style={styles.navProfileImage}
                            />
                        )}
                    </TouchableOpacity>
                </View>
            ),
            title: "Welcome " + data?.name,
            headerRight: () => (
                <Button
                    onPress={() => {
                        navigation.navigate("New post", {
                            user: data,
                        });
                    }}
                    title="Post recipe"
                />
            ),
        });
    }, [data, navigation]);

    if (!data || !posts) {
        return <ActivityIndicator visible={loading} />;
    }

    const renderContent = () => {
        if (selectedTab === "Explore" && userId && regularPosts) {
            return (
                <RecipeList
                    userId={userId}
                    route={route}
                    navigation={navigation}
                    data={regularPosts}
                />
            );
        } else if (selectedTab === "SavedRecipes" && userId && savedPosts) {
            return (
                <RecipeList
                    userId={userId}
                    route={route}
                    navigation={navigation}
                    data={savedPosts}
                />
            ); // Replace with actual Liked Recipes component or content
        } else if (selectedTab === "MyRecipes" && userId && myPosts) {
            return (
                <RecipeList
                    userId={userId}
                    route={route}
                    navigation={navigation}
                    data={myPosts}
                />
            ); // Replace with actual Liked Recipes component or content
        }
    };

    return (
        <View style={styles.container}>
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
                        selectedTab === "SavedRecipes" && styles.selectedButton,
                    ]}
                    onPress={() => setSelectedTab("SavedRecipes")}
                >
                    <Text style={styles.buttonText}>Saved recipes</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[
                        styles.button,
                        selectedTab === "MyRecipes" && styles.selectedButton,
                    ]}
                    onPress={() => setSelectedTab("MyRecipes")}
                >
                    <Text style={styles.buttonText}>My recipes</Text>
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
    headerLeftContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
    },
    navProfileImage: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10,
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
