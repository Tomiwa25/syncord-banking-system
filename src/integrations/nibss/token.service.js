const authApi = require("./auth.api");

let token = null;
let expiresAt = 0;

const getToken = async () => {
    const now = Date.now();

    // Check if the token is still valid
    if (token && now < expiresAt) {
        return token;
    }

    const response = await authApi.login();
    token = response.token || response.accessToken;
    if (!token) {
        throw new Error("NIBSS login response did not include an access token");
    }

    const expiresInSeconds = Number(response.expiresIn || response.expires_in || 3600);
    const cacheDurationMs = Math.max(expiresInSeconds - 60, 0) * 1000;
    expiresAt = now + cacheDurationMs;

    return token;
};

module.exports = { getToken };
