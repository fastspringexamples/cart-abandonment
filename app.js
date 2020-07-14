const express = require('express');

const accountsAPI = require('./apis/accounts.js');
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
                    // Send the buyer to the storefrontId
                    console.log('Create webstorefrontURL');
                    response = await Cart.createCartAbandEmail(event.data, 'webstorefrontURL');
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
