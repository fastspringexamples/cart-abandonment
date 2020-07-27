
function generateRandonEmail() {
    var chars = 'abcdefghijklmnopqrstuvwxyz1234567890';
    var email = 'jtrujillo+';
    for(var ii=0; ii<15; ii++){
        email += chars[Math.floor(Math.random() * chars.length)];
    }
    return `${email}@fastspring.com`;
}
// Global object containing example cart abandonment webhooks 
const exampleWebhooks = {
    webstorefrontURL: {
        "events": [
            {
                "type": "mailingListEntry.updated",
                "data": {
                    "id": "45b0d46432df573c51e3585e92e3e9c612f2ac2ce197c316f234c741cbf8f7df",
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
                                "imageUrl": null
                            }
                        ]
                    },
                    "email": generateRandonEmail(),
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
                    "id": "45b0d46432df573c51e3585e92e3e9c612f2ac2ce197c316f234c741cbf8f7df",
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
                                "imageUrl": null
                            },
                            {
                                "product": "phot-io-main-app",
                                "quantity": 2,
                                "display": "phot-io-main-app",
                                "summary": null,
                                "imageUrl": null
                            }
                        ]
                    },
                    "email": generateRandonEmail(),
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
                    "id": "45b0d46432df573c51e3585e92e3e9c612f2ac2ce197c316f234c741cbf8f7df",
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
                                "imageUrl": null
                            },
                            {
                                "product": "phot-io-main-app",
                                "quantity": 2,
                                "display": "phot-io-main-app",
                                "summary": null,
                                "imageUrl": null
                            }
                        ]
                    },
                    "email": generateRandonEmail(),
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
    sessionExistingAccount: {
        "events": [
            {
                "type": "mailingListEntry.updated",
                "data": {
                    "id": "45b0d46432df573c51e3585e92e3e9c612f2ac2ce197c316f234c741cbf8f7df",
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
                                "summary": null,
                                "imageUrl": null
                            },
                            {
                                "product": "cam-pack",
                                "quantity": 2,
                                "display": "cam-pack",
                                "summary": null,
                                "imageUrl": null
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
    sessionNewAccount: {
        "events": [
            {
                "type": "mailingListEntry.updated",
                "data": {
                    "id": "45b0d46432df573c51e3585e92e3e9c612f2ac2ce197c316f234c741cbf8f7df",
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
                                "summary": null,
                                "imageUrl": null
                            },
                            {
                                "product": "cam-pack",
                                "quantity": 2,
                                "display": "cam-pack",
                                "summary": null,
                                "imageUrl": null
                            }
                        ]
                    },
                    "email": generateRandonEmail(),
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
