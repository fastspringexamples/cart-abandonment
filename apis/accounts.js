const FSApi = require('../utils/FSApi.js');

// Check account
const getAccount = async (email) => {
    const account = await FSApi.get(`/accounts?email=${email}`);
    return account;
};

const createAccount = async (webhookData) => {
    const { email, firstName, lastName, country, currency } = webhookData;
    const payload = { email, firstName, lastName, country, currency };
    return FSApi.post('/accounts', payload);
};

module.exports = {
    getAccount,
    createAccount
};
