/*
 * Util functions to interact with the /accounts API endpoint
 * https://fastspring.com/docs/accounts
*/
const FSApi = require('../utils/FSApi.js');

// https://fastspring.com/docs/accounts#lookup
const getAccount = async (email) => {
    const account = await FSApi.get(`/accounts?email=${email}`);
    return account;
};

// https://fastspring.com/docs/accounts#create
const createAccount = async (webhookData) => {
    const {
        email,
        firstName,
        lastName,
        country,
        language,
    } = webhookData;
    const payload = {
        contact: {
            first: firstName,
            last: lastName,
            email
        },
        language,
        country
    };
    const account = await FSApi.post('/accounts', payload);
    return account;
};

module.exports = {
    getAccount,
    createAccount
};
