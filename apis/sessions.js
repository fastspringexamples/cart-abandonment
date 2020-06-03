const FSApi = require('../utils/FSApi.js');

// Reference https://fastspring.com/docs/sessions#creating
const createSession = async (session) => {
    const sessionRes = await FSApi.post('/sessions', session);
    return sessionRes;
};

module.exports = {
    createSession
};
