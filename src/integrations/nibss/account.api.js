const nibssClient = require("./client");
const { getToken } = require("./token.service");

const createAccount = async (data) => {
    const authToken = await getToken();
    const response = await nibssClient.post("/api/createAccount", data, {
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
    });
    return response.data;
};

const nameEnquiry = async (accountNumber) => {
    const authToken = await getToken();
    const response = await nibssClient.post(`/api/account/name-enquiry/${accountNumber}`, {}, {
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
    });
    return response.data;
};

const getAccounts = async () => {
    const authToken = await getToken();
    const response = await nibssClient.get("/api/accounts", {
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
    });
    return response.data;
};

const getBalance = async (accountNumber) => {
    const authToken = await getToken();
    const response = await nibssClient.get(`/api/account/balance/${accountNumber}`, {
        headers: {
            "Authorization": `Bearer ${authToken}`
        },
    });
    return response.data;
};

module.exports = {
    createAccount,
    nameEnquiry,
    getAccounts,
    getBalance
};