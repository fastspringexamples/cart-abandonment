const accountsAPI = require('../apis/fastspring/accounts.js');
const Cart = require('../utils/cart.js');

const handle = async (data) => {
    let response;
    // First double check if an account with this email already exists
    const resAccount = await accountsAPI.getAccount(data.email);
    if (resAccount.result === 'success') {
        const accountId = resAccount.accounts[0].account;
        data.accountId = accountId;
        response = await Cart.createCartAbandEmail(data, 'session');
    } else if (data.firstName && data.lastName) {
        // Account does not exist but we have the first and last names
        // Proceed to create a new account for this buyer
        const newAccount = await accountsAPI.createAccount(data);
        if (newAccount.error) {
            console.log(newAccount.error);
            throw new Error(`Problem creating account ${newAccount.error}`);
        }
        data.accountId = newAccount.account;
        response = await Cart.createCartAbandEmail(data, 'session');
    } else if (!data.storefront.includes('popup') && data.order.items.length === 1) {
        // Check if we can send the buyer to the storefrontId
        response = await Cart.createCartAbandEmail(data, 'webstorefrontURL');
    } else {
        // Create link to landingPage
        response = await Cart.createCartAbandEmail(data, 'landingPage');
    }
    return response;
};

module.exports = { handle };
