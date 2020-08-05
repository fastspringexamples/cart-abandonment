/* Module for interacting with the ActiveCampaign API
 * https://developers.activecampaign.com/reference#create-connection
 */
const request = require('request-promise');
const errors = require('request-promise/errors');

const API_TOKEN = {
    'Api-Token': '8376e734e22b0a3353d4ddc472383715833f246544a0eec643c84fbe1ddb1c8d79bcfc9f',
};

const SANDBOX_URL = 'https://fastspring1595923204.api-us1.com/api/3';

const get = (params) => {
    let uri = SANDBOX_URL;
    if (params) {
        uri = `${uri}${params}`;
    }

    const options = {
        uri,
        method: 'GET',
        headers: API_TOKEN,
        json: true
    };
    return request(options)
        .catch(errors.StatusCodeError, (reason) => {
            // The server responded with a status codes other than 2xx.
            return { success: false, error: reason.message };
        });
};


const post = (params, body) => {
    let uri = SANDBOX_URL;
    if (params) {
        uri = `${uri}${params}`;
    }

    const options = {
        uri,
        method: 'POST',
        headers: API_TOKEN,
        json: true,
        body
    };
    return request(options)
        .catch(errors.StatusCodeError, (reason) => {
            return { success: false, error: reason.message };
        });
};

const put = (params, body) => {
    let uri = SANDBOX_URL;
    if (params) {
        uri = `${uri}${params}`;
    }

    const options = {
        uri,
        method: 'PUT',
        headers: API_TOKEN,
        json: true,
        body
    };
    return request(options)
        .catch(errors.StatusCodeError, (reason) => {
            return { success: false, error: reason.message };
        });
};

module.exports = { get, post, put };

