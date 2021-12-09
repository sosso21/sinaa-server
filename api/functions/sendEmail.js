const nodemailer = require("nodemailer");
var sendinBlue = require("nodemailer-sendinblue-transport");
const config = require("./config.js");

const sendEmail = (
  targetEmail,
  subjectEmail,
  bodyEmail,
  { fromEmail, apiKey } = config.email.api
) => {
  const transporter = nodemailer.createTransport(
    sendinBlue({
      apiKey: apiKey,
    })
  );
 
  const mailOptions = {
    from:fromEmail,
    totargetEmail,
    subject: subjectEmail,
    html: bodyEmail,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return false;
    } else {
      return true;
    }
  });
};

module.exports = sendEmail;
