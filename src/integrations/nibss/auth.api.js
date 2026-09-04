const nibssClient = require("./client");
const env = require("../../config/env");

const onboardFintech = async (data) => {
    const response = await nibssClient.post("/api/fintech/onboard", data);
    return response.data;
};

const login = async () => {
    console.log("NIBSS BASE URL:", env.nibss.baseUrl);
    console.log("Calling NIBSS login endpoint...")
    const response = await nibssClient.post("/api/auth/token", {
        apiKey: env.nibss.apikey,
        apiSecret: env.nibss.apisecret,
    });

    console.log("NIBSS LOGIN RESPONSE:", response.data)
    return response.data;
}

module.exports = {
    onboardFintech,
    login
};
