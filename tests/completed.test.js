const app = require('../app');
const nock = require('nock');
const request = require('supertest');


test('malformed order.completed webhook', async () => {
    const exampleWebhook = {
        events2: [
            {
                type: 'order.completed',
                data: {
                    id: 'hss',
                    completed: true,
                }
            }
        ]
    };
    const res = await request(app).post('/completed').send(exampleWebhook).set('Accept', 'application/json');
    expect(res.status).toBe(500);
});

test('webhook is not order.completed webhook', async () => {
    const exampleWebhook = {
        events2: [
            {
                type: 'mailingListEntry.updated',
            }
        ]
    };
    const res = await request(app).post('/completed').send(exampleWebhook).set('Accept', 'application/json');
    expect(res.status).toBe(500);
});

test('order.completed does not have cartId tags', async () => {
    const exampleWebhook = {
        events: [
            {
                type: 'order.completed',
                data: {
                    id: 'hss',
                    completed: true,
                }
            }
        ]
    };
    const res = await request(app).post('/completed').send(exampleWebhook).set('Accept', 'application/json');
    expect(res.status).toBe(500);
});

test('successfully mark cart as complete', async () => {
    const webhookId = 'webhookId123';
    const cartId = 's';
    const exampleWebhook = {
        events: [
            {
                type: 'order.completed',
                data: {
                    id: webhookId,
                    tags: { cartId },
                    completed: true,
                }
            }
        ]
    };
    nock('https://fastspring1595923204.api-us1.com').get('/api/3/ecomOrders')
        .query(true).reply(200, { ecomOrders: [{ externalcheckoutid: 's', id: cartId }] });
    nock('https://fastspring1595923204.api-us1.com').put(`/api/3/ecomOrders/${cartId}`).reply(200, { ecomOrder: [{}] });
    const res = await request(app).post('/completed').send(exampleWebhook).set('Accept', 'application/json');
    expect(res.status).toBe(202);
    expect(res.text).toBe(webhookId);
});
