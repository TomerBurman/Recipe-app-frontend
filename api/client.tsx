import { create } from "apisauce";
import { getRefreshToken, secureTokens } from "../utilities/secureStorage";
const apiClient = create({
    baseURL: "http://192.168.0.107:3000",
    headers: { Accept: "application/vnd.github.v3+json" },
});

apiClient.axiosInstance.interceptors.response.use(
    (response) => response, // Simply return successful responses
    async (error) => {
        // Check if the response is a 403 due to invalid token
        if (
            error.response &&
            error.response.status === 403 &&
            error.config &&
            !error.config.__isRetryRequest
        ) {
            console.log("Attempting to renew token...");
            const newToken = await refresh();
            console.log(newToken);
            if (newToken) {
                // Modify the original request to use the new token
                error.config.headers["Authorization"] = `Bearer ${newToken}`;
                error.config.__isRetryRequest = true; // Mark this as a retry request
                return apiClient.axiosInstance.request(error.config);
            }
        }
        return Promise.reject(error);
    }
);

export async function refresh() {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) {
        console.log("No refresh token available");
        return null;
    }

    apiClient.setHeader("Authorization", `Bearer ${refreshToken}`);
    try {
        const response = await apiClient.get("/auth/refresh", {
            refreshToken,
        });
        if (response.ok) {
            const { accessToken, refreshToken } = response.data as {
                accessToken: string;
                refreshToken: string;
            };
            await secureTokens(accessToken, refreshToken);
            apiClient.setHeader("Authorization", `Bearer ${accessToken}`);

            return accessToken;
        } else {
            console.error("Failed to renew access token:", response.problem);
            return null;
        }
    } catch (error) {
        console.error("Network error when trying to renew token:", error);
        return null;
    }
}
export default apiClient;
