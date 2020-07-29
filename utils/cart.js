const sessionsAPI = require('../apis/sessions.js');
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
    // Create email's content
    let dummyText;
    if (cart.language === 'es') {
        dummyText =
`Hola${cart.firstName !== null ? ` ${cart.firstName}` : ''},
Visite el siguiente link para completar su compra: <a href="${cartUrl}" target="_blank">${cartUrl}</a>`;
    } else {
    dummyText =
`Hi${cart.firstName !== null ? ` ${cart.firstName}` : ''},
Here is a link to complete your purchase: <a href="${cartUrl}" target="_blank">${cartUrl}</a>`;
    }
    return dummyText;
};

module.exports = { createCartAbandEmail };
