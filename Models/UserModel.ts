import UserAPI from "../api/UserAPI";
import { Recipe } from "./RecipeModel";
import FormData from "form-data";

export type User = {
    _id: string;
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
        _id: user.userId,
        email: user.email,
        name: user.name,
        tokens: [user.accessToken, user.refreshToken],
        bio: "Loving life",
        image: user.image,
    };
    return newUser;
};

export const getUser = async (user: { userId: string }) => {
    const res = await UserAPI.getUser(user);
    return res;
};

export const savePost = async (post: Recipe) => {
    const res = await UserAPI.savePost(post);
    console.log(res.status);
    return res;
};
export const login = async (user: { email: string; password: string }) => {
    let res = await UserAPI.login(user);
    console.log(res);
    if (res.data?.userId) {
        const res2 = await getUser({
            userId: res.data.userId,
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

export const uploadImage = async (imageURI: string) => {
    var body = new FormData();
    body.append("file", { name: "name", type: "image/jpeg", uri: imageURI });
    try {
        const res = await UserAPI.uploadImage(body);

        if (!res.ok) {
            console.log("save failed " + res.problem);
            return "";
        } else {
            console.log("save passed");
            if (res.data) {
                const url: any = res.data;
                return url.url;
            }
        }
    } catch (err) {
        console.log("save failed " + err);
        return "";
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
        _id: connectedUser._id,
        accessToken: connectedUser.tokens[0],
    };
    return await UserAPI.createPost(user, post);
};

export default {
    createPost,
    register,
    uploadImage,
    login,
    setUser,
    getAllPosts,
    getUser,
};
