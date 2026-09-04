const axios = require("axios");
const env = require("../../config/env");

const nibssClient = axios.create({
    baseURL: env.NIBSS_API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

module.exports = nibssClient;