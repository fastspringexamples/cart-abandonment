/*
 * Util functions to interact with the Active Campaigns APIs for cart abandonment
*/
const util = require('util');
const ACApi = require('../../utils/ACApi.js');


// https://developers.activecampaign.com/reference#customers
const createCustomer = async (webhookData) => {
    const {
        email
    } = webhookData;
    // Hard core values for now
    const payload = {
        ecomCustomer: {
            connectionid: 2,
            externalid: 'customerId',
            email,
            acceptsMarketing: 1,
        }
    };
    const customer = await ACApi.post('/ecomCustomers', payload);
    return customer;
};

// https://developers.activecampaign.com/reference#customers
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
            connectionid: 2,
            customerid: customer.id
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
    createContact,
    createCartAbandOrder
};
