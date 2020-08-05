const sessionsAPI = require('../apis/fastspring/sessions.js');
const { createCustomer, createCartAbandOrder, createContact } = require('../apis/activecampaign');
const DBdriver = require('../utils/DBdriver.js');

const createCartLink = async (cart, solutionType) => {
    let cartUrl;
    if (solutionType === 'session') {
        // Check cart items and use the sessions API to create a 24h valid sessionId
        const { accountId, order, storefront } = cart;
        const items = order.items.map(item => ({
            product: item.product,
            quantity: item.quantity
        }));

        // Construct payload for API
        const sessionPayload = {
            account: accountId,
            items,
        };
        // Create session
        const session = await sessionsAPI.createSession(sessionPayload);
        if (session.error) {
            throw new Error(`Problems creating session: ${session.error}`);
        }
        // Create sessionURL
        const storefrontId = cart.storefront;
        const storefrontURL = storefrontId.includes('/') ?
            `${storefrontId.split('/')[0]}.test.onfastspring.com/${storefrontId.split('/')[1]}-${storefrontId.split('/')[0]}` : // Popup URL
            `${storefrontId}.test.onfastspring.com`; // Web storefront URL
        cartUrl = `https://${storefrontURL}/session/${session.id}`;
    } else if (solutionType === 'webstorefrontURL') {
        // Attach the only product path to the webstorefrontURL
        const productPath = cart.order.items[0].product;
        cartUrl = `https://${cart.storefront}.test.onfastspring.com/${productPath}`;
    } else {
        // Landing page
        // Store all the webhook information inside the database so that it can
        // be retrieved at any point by the landing page when it loads
        const { id } = cart;
        DBdriver.writeContent({ [id]: cart });
        // TODO replace domain with current server (localhost in development)
        cartUrl = `https://fs-cart-abandonment.herokuapp.com/landing.html?cartId=${id}`;
    }

    return cartUrl;
};


const sendToActiveCampaign = async (cart, cartUrl) => {
    try {
        // 1. Create e-commerce customer
        const customerRes = await createCustomer(cart);
        if (customerRes.error) {
            throw new Error(customerRes.error);
        }
        /* 
         * TODO: Problem with Contacts, contact AC team to fix it. For now ignore step
        
        // 2. Create contact and add tags
        const contactRes = await createContact(cart);
        if (contactRes.error) {
            throw new Error(contactRes.error);
        }
        */
        // 3. Create cart abandoned order to trigger automation
        const cartResult = await createCartAbandOrder(cartUrl, customerRes.ecomCustomer, cart);
        if (cartResult.error) {
            throw new Error(cartResult.error);
        }
        return { success: true };
    } catch (err) {
        const error = `Error sending data to Active Campaign:  ${err}`;
        console.log(error);
        return { success: false, error };
    }
};

/* createCartAbandEmail
 * Receives cart abandonment information as parameter and sends an email to buyer
 * with a link to the endpoint /createSession containing encrypted cart information.
 *
 * @param {Object} - webhook object
 * @returns {Integer} - 200 HTTP OK
 */
const createCartAbandEmail = async (cart, solutionType) => {
    // Create appropiate link to add to the email content
    const cartUrl = await createCartLink(cart, solutionType);

    // Send email to active campaign
    const ACResult = await sendToActiveCampaign(cart, cartUrl);

    // Return a dummy email to the frontend for testing purposes
    let cartEmail;
    if (cart.language === 'es') {
        cartEmail =
`Hola${cart.firstName !== null ? ` ${cart.firstName}` : ''},
Visite el siguiente link para completar su compra: <a href="${cartUrl}" target="_blank">${cartUrl}</a>`;
    } else {
    cartEmail =
`Hi${cart.firstName !== null ? ` ${cart.firstName}` : ''},
Here is a link to complete your purchase: <a href="${cartUrl}" target="_blank">${cartUrl}</a>`;
    }
    return { cartEmail, ACResult };
};

module.exports = { createCartAbandEmail };
