const axios = require("axios");
const env = require("../../config/env");

console.log("NIBSS BASE URL:", env.nibss.baseUrl);

const nibssClient = axios.create({
    baseURL: env.nibss.baseUrl,
    timeout: 15000,
    headers: {
        "Content-Type": "application/json",
    },
});

module.exports = nibssClient;
