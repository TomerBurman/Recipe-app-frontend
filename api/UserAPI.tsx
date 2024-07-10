import apiClient from "./client";
import { Recipe } from "../Models/RecipeModel";
import { User } from "../Models/UserModel";
import { secureTokens, secureUserId } from "../utilities/secureStorage";

const register = async (user: {
    email: string;
    password: string;
    name: string;
    bio: string;
    image: string;
}) => {
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
const login = async (user: { email: string; password: string }) => {
    try {
        const res = await apiClient.post<{
            accessToken: string;
            refreshToken: string;
            name: string;
            userId: string;
            image: string;
            bio: string;
        }>("/auth/login", user);
        if (res.data?.accessToken && res.data?.refreshToken) {
            await secureTokens(res.data.accessToken, res.data.refreshToken);
            await secureUserId(res.data.userId);
            apiClient.setHeader(
                "Authorization",
                `Bearer ${res.data.accessToken}`
            );
            return res;
        }
        return res;
    } catch (err) {
        throw err;
    }
};

const savePost = async (post: Recipe) => {
    console.log(post);
    return apiClient.put<{ post: Recipe }>("/post/", { post, _id: post._id });
};
const getUser = async (user: { userId: string }) => {
    const res = await apiClient.get<{
        email: string;
        tokens: string[];
        image: string;
        bio: string;
        userId: string;
        name: string;
    }>("/user/" + user.userId);
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
    const response = await apiClient.post<{}>("/post/", { post, user });
    return response;
};

const uploadImage = async (image: any) => {
    return await apiClient.post("/file/file/", image, {
        headers: { "Content-Type": "multipart/form-data" },
    });
};

const updateUser = async (user: User) => {
    console.log(user);
    return await apiClient.put<{ user: User }>(`/user/`, {
        connectedUser: user,
    });
};
const updatePassword = async (
    user: User,
    password: string,
    currentPassword: string
) => {
    const res = await apiClient.put<{ user: User }>("/user/", {
        connectedUser: user,
        password,
        currentPassword,
    });
    return res;
};

const getAllPosts = async (user: {
    refreshToken: string;
    accessToken: string;
}): Promise<any> => {
    try {
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

const deletePost = async (postId: string) => {
    return apiClient.delete("/post/" + postId);
};

export default {
    register,
    login,
    createPost,
    getAllPosts,
    getUser,
    uploadImage,
    savePost,
    updateUser,
    updatePassword,
    deletePost,
};
