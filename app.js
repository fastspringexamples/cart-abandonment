const express = require('express');

const { mailingListHandler, orderCompletedHandler } = require('./webhook-handlers');
const DBDriver = require('./utils/DBdriver.js');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const port = process.env.PORT || 9009;


/* POST /processor endpoint
 *
 * This endpoint serves as a test harness for the frontend to easily trigger the manual cart abandoned flow.
 * It's mainly used for demo purposes. It's only meant for consuming one webhook.
 *
 * Receives mailingListEntry.updated webhook and starts the cart abandonment process with ActiveCampaign.
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
                try {
                    // Only process mailingListEntry.updated events whose reason is 'abandoned'
                    if (event.type === 'mailingListEntry.updated' && event.data.reason === 'abandoned') {
                        const { data } = event;
                        response = await mailingListHandler.handle(data);
                    } else {
                        throw new Error('Webhook type or data.reason are not correct');
                    }
                } catch (err) {
                    const error = `An error has occurred while processing webhook ${event.data.id} : ${err.message} \n`;
                    response = { ACResult: error, cartEmail: '' };
                }
            }
            const { cartEmail, ACResult } = response;
            res.json({ success: true, cartEmail, ACResult });
        } else {
            throw new Error('Webhook payload missing events array');
        }
    } catch (err) {
        console.log('Problem satisfying webhook request', err);
        res.json({ success: false, err });
    }
});


/* POST /abandoned endpoint
 * Receives mailingListEntry.updated webhook and starts the cart abandonment process with ActiveCampaign.
 * https://fastspring.com/docs/mailinglistentry-updated/
 *
 * Unlike the /processor endpoint, this is the actual endpoint that will be used in production as the webhook handler.
 * It includes individual 202 respo
 * @param {Object} - webhook object
 * @returns {Integer} - 202 HTTP along with the webhookIds that were succesfully processed
 */
app.post('/abandoned', async (req, res) => {
    try {
        // Check that request contains an events object
        if (req.body && Array.isArray(req.body.events)) {
            const processedIds = [];
            const errors = [];
            for (const event of req.body.events) {
                try {
                    // Only process mailingListEntry.updated events whose reason is 'abandoned'
                    if (event.type === 'mailingListEntry.updated' && event.data.reason === 'abandoned') {
                        const { data } = event;
                        await mailingListHandler.handle(data);
                        processedIds.push(data.id);
                    } else if (event.type === 'mailingListEntry.updated') {
                        // Webhook got fired off because of mailing list was updated.
                        // This is not relevant for this purpose, simply ackowledge it
                        processedIds.push(event.data.id);
                    }
                } catch (err) {
                    const error = `An error has occurred while processing webhook ${event.data.id} : ${err.message} \n`;
                    errors.push(error);
                    console.log(error);
                }
            }
            // If no event could be correctly processed return 500 with error messages
            if (processedIds.length === 0) {
                throw new Error(errors);
            }

            // Only acknowledge webhooks that have been correctly processed
            res.status(202).send(processedIds.join('\n'));
        } else {
            throw new Error('Webhook payload missing events array');
        }
    } catch (err) {
        console.log('Problem satisfying webhook request', err.message);
        res.status(500).send(err.message);
    }
});

/* POST /complete endpoint
 * Receives order.completed webhook and looks for a custom order tag that represents the previously abandoned cart.
 * That cartId in the tag is used to mark the order as complete using ActiveCampaign's API
 *
 * https://fastspring.com/docs/order-completed/
 *
 * @param {Object} - webhook object
 * @returns {Integer} - 200 HTTP OK
 */
app.post('/completed', async (req, res) => {
    try {
        // Check that request contains an events object
        if (req.body && Array.isArray(req.body.events)) {
            const processedIds = [];
            const errors = [];
            for (const event of req.body.events) {
                // Only process order.completed events which were successfully completed
                try {
                    if (event.type === 'order.completed' && event.data.completed) {
                        const { data } = event;
                        await orderCompletedHandler.handle(data);
                        processedIds.push(data.id);
                    }
                } catch (err) {
                    const error = `An error has occurred while processing webhook ${event.data.id} : ${err.message} \n`;
                    errors.push(error);
                    console.log(error);
                }
            }
            // If no event could be correctly processed return 500 with error messages
            if (processedIds.length === 0) {
                throw new Error(errors);
            }
            // Acknowledge the events that were processed
            // TODO this is not working today, check with Eng
            res.set('Content-Type', 'text/html');
            res.status(202).send(processedIds.join('\n'));
        } else {
            throw new Error('Webhook payload missing events array');
        }
    } catch (err) {
        console.log('Problem satisfying webhook request', err.message);
        res.status(500).send(err.message);
    }
});

// TODO
app.get('/unprocessed', async (req, res) => {
    // Endpoint to retry failed webhooks
    // Have the API keys stored here and pass companyId to the order
    // Make sure to only process mailingListUpdated webhooks

});


/* GET /cart
 *
 * This endpoint is used by the landing page to get the webhook information stored in the database
 * based on the webhookId passed to the request
 *
 * @param {Integer} - webhook Id
 * @returns {Object} -  mailingListEntry.updated webhook object
 */
app.get('/cart', (req, res) => {
    const { cartId } = req.query;
    if (!cartId) {
        res.json({ success: false, error: 'CartId not found in request' });
        return;
    }
    // Get the content of the cartId
    // We could query the /events API, instead we'll consult our local DB
    const cartsInfo = DBDriver.getContent();
    const cart = cartsInfo[cartId];
    if (!cart) {
        res.json({ success: false, error: `Cart with id ${cartId} not found in database` });
        return;
    }
    // Manually add data-access key
    cart.accessKey = 'GD1VWQQQRZCL0I4ZCLVKUQ';
    res.json({ success: true, data: cart });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`));

module.exports = app;
