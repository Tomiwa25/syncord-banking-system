const nibssClient = require("./client");

const createAccount = async (data, token) => {

    const token = await getToken(); // Get the token from the token service
    const response = await nibssClient.post("/api/createAccount", data, {
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });
    return response.data;
};

const nameEnquiry = async (accountNumber, token) => {
    const token = await getToken(); // Get the token from the token service
    const response = await nibssClient.post(`/api/account/name-enquiry/${accountNumber}`, {
           headers: {
            "Authorization": `Bearer ${token}`
        },
    });
    return response.data;
};

const getAccounts = async (token) => {
    const token = await getToken(); // Get the token from the token service
    const response = await nibssClient.get("/api/accounts", {
        headers: {
            "Authorization": `Bearer ${token}`
        },
    });
    return response.data;
};

const getBalance = async (accountNumber, token) => {
    const token = await getToken(); // Get the token from the token service
    const response = await nibssClient.get(`/api/account/balance/${accountNumber}`, {
        headers: {
            "Authorization": `Bearer ${token}`
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