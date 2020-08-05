/*
 * Util functions to interact with the Active Campaigns APIs for cart abandonment
*/
const ACApi = require('../../utils/ACApi.js');
const util = require('util');


// https://developers.activecampaign.com/reference#customers
const createCustomer = async (webhookData) => {
    const {
        email
    } = webhookData;
    // Hard core values for now
    const payload = {
        ecomCustomer: {
            connectionid: 2,
            externalid: "customerId",
            email,
            acceptsMarketing: 1,
        }
    };
    const account = await ACApi.post('/ecomCustomers', payload);
    return account;
};



const createCartAbandOrder = async (cartUrl, customer, webhookData) => {
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
        'ecomOrder': {
            'externalcheckoutid': generateRandomId(),
            'abandoned_date': new Date(),
            'source': 1,
            'email': email,
            'orderProducts': orderProducts,
            'orderUrl': cartUrl,
            'externalCreatedDate': new Date(),
            'totalPrice': 20000,
            'taxAmount': 500,
            'discountAmount': 100,
            'currency': 'USD',
            'orderNumber': 'myorder-1234',
            'connectionid': 2,
            'customerid': customer.id
        }
    };
    console.log('PAYLOAD', util.inspect(payload, false, null, true));
    
    const cartOrder = await ACApi.post('/ecomOrders', payload);
    return cartOrder;
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
    createCustomer,
    createCartAbandOrder
};
