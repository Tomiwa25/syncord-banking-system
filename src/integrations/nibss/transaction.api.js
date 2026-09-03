const nibssClient = require("./client");

const transfer = async (data, token) => {
    const token = await getToken(); // Get the token from the token service
    const response = await nibssClient.post("/api/transfer", data, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });
    return response.data;
};

const getTransaction = async (transactionId, token) => {
    const token = await getToken(); // Get the token from the token service
    const response = await nibssClient.get(`/api/transaction/${transactionId}`, {
        headers: {
            "Authorization": `Bearer ${token}`,
        },
    });
    return response.data;
};

module.exports = {
    transfer,
    getTransaction
};