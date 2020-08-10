/*
 * Util functions to interact with the Active Campaigns APIs for cart abandonment
*/
const util = require('util');
const ACApi = require('../../utils/ACApi.js');


// https://developers.activecampaign.com/reference#create-connection
const createConnection = async (webhookData) => {
    const {
        storefront
    } = webhookData;
    
    const connectionRes = await ACApi.get('/connections');
    // Loop through connections to check if it already exists
    const existingConnection = connectionRes.connections.find((connection) => connection.service === storefront);
    if (existingConnection) {
        return existingConnection;
    }
    // TODO Create a new connection
    
};

// https://developers.activecampaign.com/reference#customers
const createCustomer = async (webhookData, connectionid) => {
    const {
        email
    } = webhookData;

    // TODO check if customers already exists before creating it.
    // There's a problem with the API though, ask AC to fix it

    // Hard core values for now
    const payload = {
        ecomCustomer: {
            connectionid,
            externalid: 'customerId',
            email,
            acceptsMarketing: 1,
        }
    };
    const customer = await ACApi.post('/ecomCustomers', payload);
    return customer;
};

// https://developers.activecampaign.com/reference#create-contact
const createContact = async (webhookData) => {
    const {
        email,
        firstName,
        lastName,
        language
    } = webhookData;

    const contactsRes = await ACApi.get(`/contacts?email=${encodeURIComponent(email)}`);
    if (!contactsRes.contacts || contactsRes.contacts.length === 0) {
        return { error: 'contact not found' };
    }
    const contact = contactsRes.contacts[0];

    // Add first and last name informations if present
    if (!contact.firstName && (firstName || lastName)) {
        const payload = {
            contact: {
                email,
                firstName,
                lastName
            }
        };
        const updatedContact = await ACApi.put(`/contacts/${contact.id}`, payload);
        console.log(updatedContact);
    }

    const tagId = language === 'es' ? 6 : 5;
    // Now that the contact is created add a custom tag for language
    const payload = {
        contactTag: {
            contact: contact.id,
            tag: tagId
        }
    };
    const resTag = await ACApi.post('/contactTags', payload);
    return resTag;
};

const createCartAbandOrder = async (connectionid, customerid, webhookData, cartUrl) => {
    const {
        email,
        order
    } = webhookData;

    const orderProducts = order.items.map(item => ({
        externalid: item.product,
        name: item.display,
        quantity: item.quantity,
        description: item.summary,
        imageUrl: item.imageUrl,
        price: 1000
    }));
    const payload = {
        ecomOrder: {
            externalcheckoutid: generateRandomId(),
            abandoned_date: new Date(),
            source: 1,
            email,
            orderProducts,
            orderUrl: cartUrl,
            externalCreatedDate: new Date(),
            totalPrice: 20000,
            taxAmount: 500,
            discountAmount: 100,
            currency: 'USD',
            orderNumber: 'myorder-1234',
            connectionid,
            customerid
        }
    };
    console.log('PAYLOAD', util.inspect(payload, false, null, true));
    const cartOrder = await ACApi.post('/ecomOrders', payload);
    return cartOrder;
};

/* findOrder
 * Query AC API to get AC order whose externalcheckoutid is the FS cartId
 *
 * @param {String} - FS cartId
 * @returns {Object} - AC Order or null
 */
const findOrder = async (cartId) => {
    const orders = await ACApi.get(`/ecomOrders?externalcheckoutid=${cartId}`);
    if (!(orders && orders.ecomOrders)) {
        console.log(`Problem looking for order with externalcheckoutid=${cartId}`, orders);
        return false;
    }
    // TODO the filtering of this endpoint is not currently working.
    // While AC team fixes this bug, we'll loop through all the existing orders manually
    const ACOrder = orders.ecomOrders.find(order => order.externalcheckoutid === cartId);
    return ACOrder;
};

/* markCartAsComplete
 * Calls AC API to mark the abandoned cart order as complete by adding an externalcheckoutid
 *
 * @param {String} - FS orderId
 * @param {String} - ActiveCampaing E-commerce OrderId
 * @returns {Object} - Updadet AC Order
 */
const markCartAsComplete = async (orderId, ACOrderId) => {
    const payload = {
        ecomOrder: {
            externalcheckoutid: orderId
        }
    };
    const result = await ACApi.put(`/ecomOrders/${ACOrderId}`, payload);
    return result;
};

// The externalcheckoutid needs to be unique every time. For now we'll use this generator
function generateRandomId() {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var checkout = 'FS';
    for(var ii=0; ii<15; ii++){
        checkout += chars[Math.floor(Math.random() * chars.length)];
    }
    return checkout;
}

module.exports = {
    createConnection,
    createCustomer,
    createContact,
    createCartAbandOrder,
    findOrder,
    markCartAsComplete,
};
