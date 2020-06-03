
const { google } = require('googleapis');
const Base64 = require('js-base64').Base64;

const API_KEY = 'AIzaSyDpakkaVsjZ4zsvaW3tDboVekAHkCwiT68';


/**
 * Build an email as an RFC 5322 formatted, Base64 encoded string
 * 
 * @param {String} to email address of the receiver
 * @param {String} from email address of the sender
 * @param {String} subject email subject
 * @param {String} message body of the email message
 */
function createEmail(to, from, subject, message) {
    let email = ["Content-Type: text/plain; charset=\"UTF-8\"\n",
        "MIME-Version: 1.0\n",
        "Content-Transfer-Encoding: 7bit\n",
        "to: ", to, "\n",
        "from: ", from, "\n",
        "subject: ", subject, "\n\n",
        message
    ].join('');

    return Base64.encodeURI(email);
}

/**
 * Send Message.
 *
 * @param  {String} userId User's email address. The special value 'me'
 * can be used to indicate the authenticated user.
 * @param  {String} email RFC 5322 formatted String.
 * @param  {Function} callback Function to call when the request is complete.
 */
function sendMessage(userId, email, callback) {
    // Do everything!
let to = 'receiver@gmail.com';
let from = 'sender@gmail.com';
let subject = 'Subject the email generated with NodeJS';
    let message = 'Big long email body that has lots of interesting content';

    
    const gmail = google.gmail({version: 'v1', auth: API_KEY });
    // Using the js-base64 library for encoding:
    // https://www.npmjs.com/package/js-base64
    var base64EncodedEmail = createEmail(to, from, subject, message);
    gmail.users.messages.send({
        'userId': 'me',
        'resource': {
            'raw': base64EncodedEmail
        }
    }).then((res) => {
        console.log(res);
        callback(res)
    });
}

module.exports = { sendMessage };
