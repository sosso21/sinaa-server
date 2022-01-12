const sendEmail = require("./sendEmail.js");
const fs = require("fs");
const config = require("./config");

const sendMeEmailToConfirm = (
  firstname,
  lastname,
  token,
  email,
  lang = "en"
) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      __dirname + "/templateEmail/confirmationReegister_" + lang + ".txt",
      "utf-8",
      async (err, data) => {
        data = await data
          .split("%firstname%")
          .join(firstname)
          .split("%lastname%")
          .join(lastname)
          .split("%linkAPI%")
          .join(config.urlAPI)
          .split("%token%")
          .join(token);
        let object = "";
        if (lang == "fr") {
          object = "confirmez Votre E-mail";
        } else if (lang == "ar") {
          object = "قم بتأكيد بريدك الإلكتروني";
        } else {
          object = "confirm your E-mail";
        }
        sendEmail(email, object, data);
        resolve(true);
      }
    );
  });
};

const sendMeEmailToResetPassowrd = (lang = "en", token, email, infoUser) => {
  return new Promise((resolve, reject) => {
    fs.readFile(
      __dirname + "/templateEmail/mpmissing_" + lang + ".txt",
      "utf-8",
      async (err, data) => {
        data = await data
          .split("%firstname%")
          .join(infoUser.firstname)
          .split("%lastname%")
          .join(infoUser.lastname)
          .split("%linkClient%")
          .join(config.urlClient)
          .split("%token%")
          .join(token);
        let object = "";
        if (lang == "fr") {
          object = "Réinitialiser Votre mot de passe";
        } else if (lang == "ar") {
          object = "اعد ضبط كلمه السر";
        } else {
          object = "Reset your password";
        }
        sendEmail(email, object, data);

        resolve(true);
      }
    );
  });
};

module.exports = { sendMeEmailToConfirm, sendMeEmailToResetPassowrd };
