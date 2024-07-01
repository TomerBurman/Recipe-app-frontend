import apiClient from "./client";
import { Recipe } from "../Models/RecipeModel";

const register = async (user: {
    email: string;
    password: string;
    name: string;
    bio: string;
    image: string;
}) => {
    console.log("Registering with details: " + user.email);
    try {
        return apiClient.post<{
            email: string;
            password: string;
            name: string;
            bio: string;
            image: string;
            tokens: string[];
        }>("/auth/register", user);
    } catch (err) {
        console.log(err);
    }
};

const getUser = async (user: { userId: string; accessToken: string }) => {
    apiClient.setHeader("Authorization", "Bearer " + user.accessToken);
    const res = apiClient.get<{
        email: string;
        tokens: string[];
        image: string;
        bio: string;
        id: string;
        name: string;
    }>("/user/" + user.userId);
    return res;
};
const login = async (user: { email: string; password: string }) => {
    const res = await apiClient.post<{
        accessToken: string;
        refreshToken: string;
        name: string;
        userId: string;
        image: string;
        bio: string;
    }>("/auth/login", user);
    return res;
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

const uploadImage = async (image: any) => {
    console.log(image);
    return apiClient.post("/file/file/", image, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

const getAllPosts = async (user: {
    refreshToken: string;
    accessToken: string;
}): Promise<any> => {
    try {
        console.log(user.accessToken, user.refreshToken);
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
    getUser,
    uploadImage,
};
