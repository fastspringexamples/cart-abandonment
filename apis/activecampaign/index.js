/*
 * Util functions to interact with the Active Campaigns APIs for cart abandonment
*/
const ACApi = require('../../utils/ACApi.js');

const SELLER_FIELDS = {
    SELLER_NAME: 1,
    SELLER_LOGO: 2,
    SELLER_LINK: 5
};

const LANG_TAGS = {
    es: 6,
    en: 5
};

// https://developers.activecampaign.com/reference#create-connection
const getConnection = async (storefront) => {
    // Cleanse storefront so that we only get the actual store
    const store = storefront.includes('/') ? storefront.split('/')[0] : storefront;
    const connectionRes = await ACApi.get(`/connections?filters[externalid]=${store}`);
    if (connectionRes && connectionRes.connections.length > 0) {
        return connectionRes.connections[0];
    }
    return connectionRes; // No connection found for that storefront
};

// https://developers.activecampaign.com/reference#customers
const createCustomer = async (webhookData, connectionid) => {
    const {
        email
    } = webhookData;

    const customerRes = await ACApi.get(`/ecomCustomers?filters[email]=${encodeURIComponent(email)}&filters[connectionid]=${connectionid}`);

    if (customerRes && customerRes.ecomCustomers.length > 0) {
        // Customer found
        return customerRes.ecomCustomers[0];
    }

    // Customer is new, create a new Customer
    const payload = {
        ecomCustomer: {
            connectionid,
            externalid: 'customerId',
            email,
            acceptsMarketing: 1,
        }
    };
    const customer = await ACApi.post('/ecomCustomers', payload);
    if (customer.error) {
        return customer;
    }
    return customer.ecomCustomer;
};

// https://developers.activecampaign.com/reference#create-contact
const createContact = async (webhookData, connection) => {
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
    //if (!contact.firstName && (firstName || lastName)) {
    // TODO what happens a buyer currently in two different cart abandonment processes?
    const payload = {
        contact: {
            email,
            firstName,
            lastName,
            fieldValues: [
                {
                    field: SELLER_FIELDS.SELLER_NAME,
                    value: connection.name
                },
                {
                    field: SELLER_FIELDS.SELLER_LOGO,
                    value: connection.logoUrl
                },
                {
                    field: SELLER_FIELDS.SELLER_LINK,
                    value: connection.linkUrl
                }
            ]
        }
    };
    const updatedContact = await ACApi.put(`/contacts/${contact.id}`, payload);
    if (updatedContact.error) {
        console.log(updatedContact); // TODO what if this fails?
    }

    const tagId = language === 'es' ? LANG_TAGS.es : LANG_TAGS.en;
    // Now that the contact is created add a custom tag for language
    const langPayload = {
        contactTag: {
            contact: contact.id,
            tag: tagId
        }
    };

    const resTag = await ACApi.post('/contactTags', langPayload);
    // TODO what if this fails?
    return resTag;
};

const createCartAbandOrder = async (connectionid, customerid, webhookData, cartUrl) => {
    const {
        email,
        order,
        id,
        currency
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
            externalcheckoutid: id,
            abandoned_date: new Date(),
            source: 1,
            email,
            orderProducts,
            orderUrl: cartUrl,
            externalCreatedDate: new Date(),
            totalPrice: 20000,
            taxAmount: 500,
            discountAmount: 100,
            currency,
            orderNumber: id,
            connectionid,
            customerid
        }
    };
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
    const orders = await ACApi.get(`/ecomOrders?filters[externalcheckoutid]=${cartId}`);
    if (!(orders && orders.ecomOrders)) {
        console.log(`Problem looking for order with externalcheckoutid=${cartId}`, orders);
        return false;
    }
    const ACOrder = orders.ecomOrders.find(order => order.externalcheckoutid === cartId);
    return ACOrder;
};

/* markCartAsComplete
 * Calls AC API to mark the abandoned cart order as complete by adding an externalid
 *
 * @param {String} - FS orderId
 * @param {String} - ActiveCampaing E-commerce OrderId
 * @returns {Object} - Updadet AC Order
 */
const markCartAsComplete = async (orderId, ACOrderId) => {
    const payload = {
        ecomOrder: {
            externalid: orderId
        }
    };
    const result = await ACApi.put(`/ecomOrders/${ACOrderId}`, payload);
    return result;
};

module.exports = {
    getConnection,
    createCustomer,
    createContact,
    createCartAbandOrder,
    findOrder,
    markCartAsComplete,
};
