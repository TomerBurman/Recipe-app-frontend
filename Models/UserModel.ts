import UserAPI from "../api/UserAPI";
import { Recipe } from "./RecipeModel";

export type User = {
    userId: string;
    email: string;
    name: string;
    tokens: string[];
    bio: string;
};

export const setUser = (user: {
    name: string;
    email: string;
    userId: string;
    refreshToken: string;
    accessToken: string;
}): User => {
    const newUser: User = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        tokens: [user.accessToken, user.refreshToken],
        bio: "Loving life",
    };
    return newUser;
};

export const getAllPosts = async (user: {
    accessToken: string;
    refreshToken: string;
}): Promise<Recipe[]> => {
    try {
        const response = await UserAPI.getAllPosts(user);
        // Check if response has data
        if (response && response.data) {
            const recipes: Recipe[] = response.data;
            return recipes;
        } else {
            return [];
        }
    } catch (err) {
        console.log("Error fetching posts:", err);
        return [];
    }
};

export const createPost = async (
    connectedUser: User,
    post: {
        title: string;
        ingredients: string[];
        description: string;
        steps: string[];
        images: string[];
        ownerName: string;
    }
) => {
    const user = {
        _id: connectedUser.userId,
        accessToken: connectedUser.tokens[0],
    };
    return await UserAPI.createPost(user, post);
};
