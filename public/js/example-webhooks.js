
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
// Global object containing example cart abandonment webhooks 
const exampleWebhooks = {
    webstorefrontURL: {
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
    },
    landingPageWeb: {
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
                            },
                            {
                                "product": "phot-io-main-app",
                                "quantity": 2,
                                "display": "phot-io-main-app",
                                "summary": "WAHOOOO!  An incredible, full-featured ecosystem for managing digital imagery throughout the entire asset lifecycle regardless of the size and scope of your enterprise.",
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/v70BxblbRv0/photio-imac-hero.png"
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
    },
    landingPagePopup: {
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
                            },
                            {
                                "product": "phot-io-main-app",
                                "quantity": 2,
                                "display": "phot-io-main-app",
                                "summary": "WAHOOOO!  An incredible, full-featured ecosystem for managing digital imagery throughout the entire asset lifecycle regardless of the size and scope of your enterprise.",
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/v70BxblbRv0/photio-imac-hero.png"
                            }
                        ]
                    },
                    "email": generateRandomEmail(),
                    "firstName": null,
                    "lastName": null,
                    "country": "NL",
                    "currency": "EUR",
                    "language": "en",
                    "storefront": "fastspringexamplesii/popup"
                }
            }
        ]
    },
    sessionExistingAccountWeb: {
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
                                "product": "phot-io-main-app",
                                "quantity": 1,
                                "display": "phot-io-main-app",
                                "summary": "WAHOOOO!  An incredible, full-featured ecosystem for managing digital imagery throughout the entire asset lifecycle regardless of the size and scope of your enterprise.",
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/v70BxblbRv0/photio-imac-hero.png"
                            },
                            {
                                "product": "cam-pack",
                                "quantity": 2,
                                "display": "cam-pack",
                                "summary": null,
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/LElLgQ6PR4k/thumbnail-cam-pack.png"
                            }
                        ]
                    },
                    "email": "jtrujillo@fastspring.com",
                    "firstName": null,
                    "lastName": null,
                    "country": "NL",
                    "currency": "EUR",
                    "language": "en",
                    "storefront": "fastspringexamplesii"
                }
            }
        ]
    },
    sessionExistingAccountPopup: {
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
                                "product": "phot-io-main-app",
                                "quantity": 1,
                                "display": "phot-io-main-app",
                                "summary": "WAHOOOO!  An incredible, full-featured ecosystem for managing digital imagery throughout the entire asset lifecycle regardless of the size and scope of your enterprise.",
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/v70BxblbRv0/photio-imac-hero.png"
                            },
                            {
                                "product": "cam-pack",
                                "quantity": 2,
                                "display": "cam-pack",
                                "summary": null,
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/LElLgQ6PR4k/thumbnail-cam-pack.png"
                            }
                        ]
                    },
                    "email": "jtrujillo@fastspring.com",
                    "firstName": null,
                    "lastName": null,
                    "country": "NL",
                    "currency": "EUR",
                    "language": "en",
                    "storefront": "fastspringexamplesii/popup"
                }
            }
        ]
    },
    sessionNewAccount: {
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
                                "product": "phot-io-main-app",
                                "quantity": 1,
                                "display": "phot-io-main-app",
                                "summary": "WAHOOOO!  An incredible, full-featured ecosystem for managing digital imagery throughout the entire asset lifecycle regardless of the size and scope of your enterprise.",
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/v70BxblbRv0/photio-imac-hero.png"
                            },
                            {
                                "product": "cam-pack",
                                "quantity": 2,
                                "display": "cam-pack",
                                "summary": null,
                                "imageUrl": "https://d8y8nchqlnmka.cloudfront.net/C0ar6e4kSTE/LElLgQ6PR4k/thumbnail-cam-pack.png"
                            }
                        ]
                    },
                    "email": generateRandomEmail(),
                    "firstName": "Jhon",
                    "lastName": "Doe",
                    "country": "NL",
                    "currency": "EUR",
                    "language": "en",
                    "storefront": "fastspringexamplesii"
                }
            }
        ]
    }
};
