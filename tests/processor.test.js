const app = require('../app');
const nock = require('nock');
const request = require('supertest');

const FS_URL = 'https://api.fastspring.com';
const AC_URL = 'https://fastspring1595923204.api-us1.com';


function generateRandomEmail() {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var email = 'jtrujillo+';
    for(var ii=0; ii<15; ii++){
        email += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${email}@fastspring.com`;
}


function generateRandomId() {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var id = '';
    for(var ii=0; ii<25; ii++){
        id += chars[Math.floor(Math.random() * chars.length)];
    }
    return id;
}

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

// Create a test per possible flow
test('successful flow: webstorefrontURL ', async () => {
    const exampleWebhook = {
        "events": [
            {
                "type": "mailingListEntry.updated",
                "data": {
                    "id": generateRandomId(),
                    "list": "abandoned",
                    "updated": 1589211085005,
                    "reason": "abandoned",
                    "order": {
                        "reference": null,
                        "id": null,
                        "order": null,
                        "items": [
                            {
                                "product": "cam-pack",
                                "quantity": 1,
                                "display": "cam-pack",
                                "summary": null,
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/LElLgQ6PR4k/thumbnail-cam-pack.png"
                            }
                        ]
                    },
                    "email": generateRandomEmail(),
                    "firstName": null,
                    "lastName": null,
                    "country": "NL",
                    "currency": "EUR",
                    "language": "en",
                    "storefront": "fastspringexamplesii"
                }
            }
        ]
    };

    nock(FS_URL).get('/accounts').query(true).reply(200, { result: null });
    nock(AC_URL).get('/api/3/ecomCustomers')
        .query(true).reply(200, { ecomCustomers: [{ id: 'customerId' }] });
    nock(AC_URL).get('/api/3/contacts')
        .query(true).reply(200, { contacts: [{ id: 'contactId' }] });
    nock(AC_URL).post('/api/3/contactTags')
        .reply(200, { success: true });
    nock(AC_URL).post('/api/3/ecomOrders')
        .query(true).reply(200, { success: true });

    const res = await request(app).post('/processor').send(exampleWebhook).set('Accept', 'application/json');
    expect(res.status).toBe(200);
});
