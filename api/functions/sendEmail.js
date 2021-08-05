const nodemailer = require('nodemailer');
const config = require("./config.js");


const sendEmail = (targetEmail, subjectEmail, bodyEmail ,{ OurEMail,passEmail}=config.email.api ) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: OurEMail,
            pass: passEmail
        }
    });

    const mailOptions = {
        from: OurEMail,
        to: targetEmail,
        subject: subjectEmail,
        html: bodyEmail
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return false
        } else {
            return true
        }
    });
}

module.exports = sendEmail