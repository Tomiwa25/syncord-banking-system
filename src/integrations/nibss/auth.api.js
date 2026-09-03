const nibssClient = require("./client");
const env = require("../../config/env");

const onboardFintech = async (data) => {
    const response = await nibssClient.post("/api/fintech/onboard", data);
    return response.data;
};

const login = async () => {
    const response = await nibssClient.post("/api/auth/login", {
        apiKey: env.NIBSS_API_KEY,
        apiSecret: env.NIBSS_API_SECRET,
    });
    return response.data;
}

module.exports = {
    onboardFintech,
    login
};