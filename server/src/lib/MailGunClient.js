const FormData = require("form-data"); // form-data v4.0.1
const Mailgun = require("mailgun.js"); // mailgun.js v11.1.0

class MailgunClient {
    static async sendEmail(email, subject, text) {
        const mailgun = new Mailgun(FormData);
        const mg = mailgun.client({
            username: "api",
            key: process.env.MAILGUN_API_KEY || "API_KEY",
        });
        try {
            const data = await mg.messages.create("sandboxae7d646ff7dc49828f3bef83f839e48f.mailgun.org", {
                from: "Mailgun Sandbox <postmaster@sandboxae7d646ff7dc49828f3bef83f839e48f.mailgun.org>",
                to: [email],
                subject: subject,
                text: text,
            });

            console.log(data); // logs response data
        } catch (error) {
            console.log(error); //logs any error
        }
    }
}

module.exports = MailgunClient;