import UserAPI from "../api/UserAPI";
import { Recipe } from "./RecipeModel";

export type User = {
    userId: string;
    email: string;
    name: string;
    tokens: string[];
    bio: string;
    image: string;
};

export const setUser = (user: {
    name: string;
    email: string;
    userId: string;
    refreshToken: string;
    accessToken: string;
    image: string;
}): User => {
    const newUser: User = {
        userId: user.userId,
        email: user.email,
        name: user.name,
        tokens: [user.accessToken, user.refreshToken],
        bio: "Loving life",
        image: user.image,
    };
    return newUser;
};

export const getUser = async (user: {
    userId: string;
    accessToken: string;
}) => {
    const res = UserAPI.getUser(user);
    return res;
};

export const login = async (user: { email: string; password: string }) => {
    let res = await UserAPI.login(user);
    if (res.data?.userId) {
        const res2 = await getUser({
            userId: res.data.userId,
            accessToken: res.data.accessToken,
        });
        if (res2.data) {
            const { image, bio } = res2.data;
            res.data = { ...res.data, image, bio };
        }
    } else {
        console.error("User ID is undefined");
    }
    return res;
};

export const getAllPosts = async (user: {
    accessToken: string;
    refreshToken: string;
}): Promise<Recipe[]> => {
    try {
        console.log(user.accessToken + " This is access token");
        console.log(user.refreshToken + " This is refresh token");
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

export const register = async (user: {
    email: string;
    password: string;
    name: string;
    bio: string;
    image: string;
}) => {
    const res = await UserAPI.register(user);
    return res;
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
