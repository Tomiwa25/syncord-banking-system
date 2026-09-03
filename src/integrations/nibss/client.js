const axios = require("axios");
const env = require("../../config/env");

exports.nibssClient = axios.create({
    baseURL: env.NIBSS_API_BASE_URL,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});