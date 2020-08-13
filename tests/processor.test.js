const app = require('../app');
const nock = require('nock');
const request = require('supertest');

// TODO
test('malformed mailingListEntry.updated webhook', async () => {
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
