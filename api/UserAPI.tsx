import apiClient from "./client";
import { Recipe } from "../Models/RecipeModel";

const register = async (user: {
    email: string;
    password: string;
    name: string;
    bio: string;
}) => {
    console.log("Registering with details: " + user.email);
    try {
        return apiClient.post<{
            email: string;
            password: string;
            name: string;
            bio: string;
            tokens: string[];
        }>("/auth/register", user);
    } catch (err) {
        console.log(err);
    }
};
const login = async (user: { email: string; password: string }) => {
    return apiClient.post<{
        accessToken: string;
        refreshToken: string;
        name: string;
        userId: string;
    }>("/auth/login", user);
};

const createPost = async (
    user: { _id: string; accessToken: string },
    post: {
        title: string;
        ingredients: string[];
        description: string;
        steps: string[];
        images: string[];
        ownerName: string;
    }
) => {
    apiClient.setHeader("Authorization", "Bearer " + user.accessToken);
    const response = await apiClient.post<{}>("/post/", { post, user });
    return response;
};

const getAllPosts = async (user: {
    refreshToken: string;
    accessToken: string;
}): Promise<any> => {
    try {
        apiClient.setHeader("Authorization", "Bearer " + user.accessToken);
        const response = await apiClient.get<{
            data: Recipe[];
        }>("/post");
        if (response.ok && response.data) {
            return response;
        } else {
            console.error("Failed to fetch posts:", response);
            return [];
        }
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};

export default {
    register,
    login,
    createPost,
    getAllPosts,
};
