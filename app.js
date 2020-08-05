const express = require('express');

const accountsAPI = require('./apis/fastspring/accounts.js');
const Cart = require('./utils/cart.js');
const DBDriver = require('./utils/DBdriver.js');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const port = process.env.PORT || 9009;


/* POST /processor endpoint
 * Receives mailingListEntry.updated webhook and creates a cart abandonment email if it applies.
 * https://fastspring.com/docs/mailinglistentry-updated/
 *
 * @param {Object} - webhook object
 * @returns {Integer} - 200 HTTP OK
 */
app.post('/processor', async (req, res) => {
    try {
        // Check that request contains an events object
        if (req.body && Array.isArray(req.body.events)) {
            let response;
            for (const event of req.body.events) {
                // Only process mailingListEntry.updated events whose reason is 'abandoned'
                if (event.type === 'mailingListEntry.updated' && event.data.reason === 'abandoned') {
                    const { data } = event;
                    // First double check if an account with this email already exists
                    const resAccount = await accountsAPI.getAccount(data.email);
                    if (resAccount.result === 'success') {
                        const accountId = resAccount.accounts[0].account;
                        data.accountId = accountId;
                        // Do we also want to include more data like address and company?
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
                }
            }
            res.json({ success: true, cartUrl: response });
        } else {
            throw new Error('Webhook payload missing events array');
        }
    } catch (err) {
        console.log('An error has occurred while processing webhook: ', err.message);
        res.json({ success: false, error: err.message });
    }
});


app.get('/cart', (req, res) => {
    const { cartId } = req.query;
    if (!cartId) {
        res.json({ success: false, error: 'CartId not found in request' });
        return;
    }
    // Get the content of the cartId
    // We could query the /events API, instead we'll consult our local DB
    const cartsInfo = DBDriver.getContent();
    console.log(cartsInfo);
    // TODO check error when id not found
    const cart = cartsInfo[cartId];
    if (!cart) {
        res.json({ success: false, error: `Cart with id ${cartId} not found in database` });
        return;
    }
    // TODO manually add data-access key
    cart.accessKey = 'GD1VWQQQRZCL0I4ZCLVKUQ';
    res.json({ success: true, data: cart });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
