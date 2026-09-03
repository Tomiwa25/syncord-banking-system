const authApi = require("./auth.api");

let token = null;
let expiresAt = 0;

const getToken = async () => {
    const now = Date.now();

    // Check if the token is still valid
    if (token && now < expiresAt) {
        return token;
    }

    const  response = await authApi.login();
    token = response.token;
    expiresAt = now + 55 * 60 * 1000; // Convert expiresIn from seconds to milliseconds

    return token;
};

module.exports = { getToken };