const nibssClient = require("./client");
const { getToken } = require("./token.service");

const transfer = async (data) => {
    const authToken = await getToken();
    const response = await nibssClient.post("/api/transfer", data, {
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
    });
    return response.data;
};

const getTransaction = async (transactionId) => {
    const authToken = await getToken();
    const response = await nibssClient.get(`/api/transaction/${transactionId}`, {
        headers: {
            "Authorization": `Bearer ${authToken}`,
        },
    });
    return response.data;
};

module.exports = {
    transfer,
    getTransaction
};