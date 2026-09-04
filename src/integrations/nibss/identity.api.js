const nibssClient = require("./client");
const { getToken } = require("./token.service");

const validateBvn = async (bvn) => {
    const authToken = await getToken();
    const response = await nibssClient.post("/api/validateBvn", {
        bvn
    }, {
        headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
};

const validateNin = async (nin) => {
    const authToken = await getToken();
    const response = await nibssClient.post("/api/validateNin", {
        nin
    }, {
        headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
};

const insertBvn = async (data) => {
    const authToken = await getToken();
    const response = await nibssClient.post("/api/insertBvn", data, {
        headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
};

const insertNin = async (data) => {
    const authToken = await getToken();
    const response = await nibssClient.post("/api/insertNin", data, {
        headers: { Authorization: `Bearer ${authToken}` },
    });
    return response.data;
};

module.exports = {
    validateBvn,
    validateNin,
    insertBvn,
    insertNin
};
