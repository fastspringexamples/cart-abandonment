const ACApi = require('../apis/activecampaign');

const handle = async (data) => {
    // First double check if an account with this email already exists
    // Get cartId from tags
    if (!(data.tags && data.tags.cartId)) {
        throw new Error('No cartId found in tags');
    }
    const { cartId } = data.tags;
    const ACOrder = await ACApi.findOrder(cartId);
    if (!ACOrder) {
        throw new Error(`No AC order found associated to cartId ${cartId}`);
    }

    const completedCart = await ACApi.markCartAsComplete(data.id, ACOrder.id);
    if (!(completedCart && completedCart.ecomOrder)) {
        throw new Error(`Order ${data.id} with CartId ${cartId} could not be marked
                        as completeted for order ${ACOrder.id}`);
    }
    return true;
};

module.exports = { handle };
