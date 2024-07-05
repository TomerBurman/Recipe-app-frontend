import * as SecureStorage from "expo-secure-store";

export async function secureTokens(accessToken: string, refreshToken: string) {
    try {
        await SecureStorage.setItemAsync(
            "userTokens",
            JSON.stringify({ accessToken, refreshToken })
        );
    } catch (err) {
        console.log("Error storing the auth tokens", err);
    }
}

export async function secureUserId(userId: string) {
    try {
        await SecureStorage.setItemAsync("userId", JSON.stringify({ userId }));
    } catch (err) {
        console.log("Error setting the userId", err);
    }
}
export async function getUserId() {
    try {
        const userId = await SecureStorage.getItemAsync("userId");
        return JSON.parse(userId as string).userId;
    } catch (err) {
        console.log("Error setting the userId", err);
    }
}
export async function getAccessToken() {
    try {
        const tokens = await SecureStorage.getItemAsync("userTokens");
        return JSON.parse(tokens as string).accessToken;
    } catch (error) {
        console.log("Error getting the auth tokens", error);
    }
}

export async function getRefreshToken() {
    try {
        const tokens = await SecureStorage.getItemAsync("userTokens");
        return JSON.parse(tokens as string).refreshToken;
    } catch (error) {
        console.log("Error getting the auth tokens", error);
    }
}

export async function RemoveTokens() {
    try {
        await SecureStorage.deleteItemAsync("userTokens");
    } catch (error) {
        console.log("Error removing the auth tokens", error);
    }
}
