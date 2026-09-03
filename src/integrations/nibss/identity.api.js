const nibssClient = require("./client");

const validateBvn = async (bvn) => {
    const response = await nibssClient.post("/api/validateBvn", {
        bvn
    });
    return response.data;
};

const validateNin = async (nin) => {
    const response = await nibssClient.post("/api/validateNin", {
        nin
    });
    return response.data;
};

const insertBvn = async (data) => {
    const response = await nibssClient.post("/api/insertBvn", data);
    return response.data;
};

const insertNin = async (data) => {
    const response = await nibssClient.post("/api/insertNin", data);
    return response.data;
};

module.exports = {
    validateBvn,
    validateNin,
    insertBvn,
    insertNin
};