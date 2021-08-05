"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 
 */

/*
npm i -S  fs
npm i -S  email-deep-validator

npm i -S  bcrypt
npm i -S  password-validator
npm i -S  jsonwebtoken
npm i -S  nodemailer 
npm i -S  yup 

*/
const {
  verifyEmail,
  verifyPass,
  verifyName,
} = require("../../functions/emailPassVerificator.js");
const sendEmail = require("../../functions/sendEmail.js");
const jwt_utils = require("../../functions/jwt.utils.js");
const fs = require("fs");
const bcrypt = require("bcrypt");

const sendMeEmailToConfirm = (firstname, lastname, token, email, lang="en") => {
  
  return new Promise( (resolve, reject) => {
  fs.readFile(

    __dirname + "/../../functions/templateEmail/confirmationReegister_" + lang + ".txt",
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
        let  object="";
        if (lang=="fr") {
          object="confirmez votre E-mail";
        }else  if (lang=="ar") {
          object="قم بتأكيد بريدك الإلكتروني";
        }else{
          object="confirm your E-mail";
        }
        sendEmail(email, object, data);
        resolve(true)
    }
  );
  })
};
const config = require("../../functions/config.js");
const json_schema = require("../../functions/schema.js");


const getPublicInfo=({email,firstname,_id,lastname,sexe,username, phone,birth_day,birth_place,wilaya,commune,profil_image_link,instagram,Twitter,facebook})=>{
  return {email,firstname,_id,lastname,sexe,username, phone,birth_day,birth_place,wilaya,commune,profil_image_link,instagram,Twitter,facebook}
}

const extractInfo = ({token,...infos})=> infos ;


module.exports = {
  // connect
  connect: async (ctx) => {
    const ISO = ctx.request.header["user-agent"];
    const error = (error = "email pass incorrect") => {
      ctx.send({
        error: error,
      });
    };

    const success =async (infoUserAll) => {
      const  infoUser =getPublicInfo(infoUserAll);
      const token = jwt_utils.generateTokenForUser(infoUser, 3600 * 24 * 90, {
        ISO: ISO,
      });

      await strapi.query("clients").update(
        { _id: infoUser._id },
        { lastConnect: new Date()}
      );

      return ctx.send({
        token: token,
        userInfo: {
          ...infoUser,
          firstname: infoUser.firstname
        },
      });
    };

    if (
      ctx.request.body.email != undefined &&
      ctx.request.body.pass != undefined
    ) {
      const email = ctx.request.body.email.toLowerCase();
      const pass = ctx.request.body.pass;
      const infoUser = await strapi.query("clients").findOne({
        email: email,
      });
      
      if (infoUser == null) {
        return error();
      }

      const correct = await bcrypt.compare(pass, infoUser.pass);
      if (correct) {
        if (infoUser.status == "waiting") {
          return error("waiting");
        } else if (infoUser.status == "blocked") {
          return error("account blocked");
        } else {
          return success(infoUser);
        }

      } else {
        return error();
      }
    } else if (ctx.request.body.token != undefined) {
      const decodeToken = jwt_utils.getUserInfo(ctx.request.body.token);
      if (decodeToken != -1 && decodeToken.ISO == ISO) {
        const infouser = await strapi.query("clients").findOne({
          _id: decodeToken.userId,
          status: "valid",
        });

        if (infouser == null) {
          return error("disconnect");
        }
        return success(infouser);
      } else {
        return error("disconnect");
      }
    } else {
      return error("error");
    }
  },

  // inscription
  subscribe: async (ctx) => {
    const {
      username,
      firstname,
      lastname,
      email,
      pass,
      lang
    } = ctx.request.body;


    if (!verifyName(firstname) || !verifyName(lastname) || !verifyName(username) || username.includes(" ")) {
      return ctx.send({
        error: "short name"
      });
    }
    if (!(await verifyEmail(email))) {
      return ctx.send({
        error: "email invalid",
      });
    }
    if (!verifyPass(pass)) {
      return ctx.send({
        error: "pass short"
      });
    }
    const exist = await strapi.query("clients").model.find({
      $or: [{
          email: email.toLowerCase()
        },
        {
          username: username.toLowerCase()
        }
      ]
    });
    if (exist.length != 0) {
      return ctx.send({
        error: "info already exists",
      });
    }


    const hashPasword = await bcrypt.hash(pass, 10);

    const savedUser = await strapi.query("clients").create({
      username: username.toLowerCase(),
      firstname: firstname.toLowerCase(),
      lastname: lastname.toLowerCase(),
      email: email.toLowerCase(),
      pass: hashPasword,
      status: "waiting",
      sexe: "none"
    });

    const token = jwt_utils.generateTokenForUser(savedUser, 60 * 15,{email:savedUser.email} );

    await sendMeEmailToConfirm(firstname, lastname, token, email, lang);

    ctx.send({
      success: `email sended`,
    });
  },

  // confirm email
  confirmEmailGet: async (ctx) => {
    const token = ctx.params.token;
    const auth = jwt_utils.getUserInfo(token);

    
    if (auth != -1) {
      
      const authUser = await strapi.query("clients").update({
        _id: auth.userId,
        status:{$ne:"blocked",}
      },
      {
        email: auth.email,
        status:(auth.status=="waiting")?"valid":auth.status,
      }
      );
      console.log('auth != -1:',auth != -1)
      console.log('\n ***** \n authUser:',authUser)
        if (authUser == null) {
          return ctx.send("<h1>error link, please retry </h1>");
        }
         else{
           ctx.redirect(config.urlClient + "/login");
         }
     
    } else {
      ctx.send("<h1> error: link expired</h1>");
    }
  },

  // send email to confirm-
  sendEmailToConfirm: async (ctx) => {
    const email = ctx.params.langNEmail.split("%%")[1];
    const lang = ctx.params.langNEmail.split("%%")[0];

    const user = await strapi.query("clients").findOne({
      email: email,

    });

    if (user != undefined) {
      if (user.status == "blocked") {
        return ctx.send({
          error: "blocked"
        })
      } else if (user.status == "valid") {
        return ctx.send({
          success: "valid"
        })

      } else {
        const token = jwt_utils.generateTokenForUser(user, 60 * 15,{email:user.email});
        await sendMeEmailToConfirm(user.firstname, user.lastname, token, user.email, lang);

        return ctx.send({
          success: "sended"
        })
      }
    } else {
      return ctx.send({
        error: "user not found"
      })
    }

  },

  // send email to reset password
  sendEmailToResetPassword: async (ctx) => {

    const email = ctx.params.langNEmail.split("%%")[1];
    const lang = ctx.params.langNEmail.split("%%")[0];

    const infoUser = await strapi.query("clients").findOne({
      email: email,
    });
    if (infoUser != null) {
      const token = await jwt_utils.generateTokenForUser({
          _id: infoUser._id,
          status: infoUser.status,
        },
        60 * 15
      );
      console.log('\n -*-*--*-*-* token!', token)


      fs.readFile(
        __dirname + "/../../functions/templateEmail/mpmissing_" + lang + ".txt",
        "utf-8",
        async(err, data) => {
          data = await data
            .split("%firstnam%")
            .join(infoUser.firstname)
            .split("%lastnam%")
            .join(infoUser.lastname)
            .split("%linkClient%")
            .join(config.urlClient)
            .split("%token%")
            .join(token);
          sendEmail(email, "Réinitialiser Votre mot de passe", data);
        }
      );
      ctx.send({
        response: "success",
      });
    } else {
      ctx.send({
        response: "not Found email",
      });
    }
  },

  // reset forget password
  resetForgetPassword: async (ctx) => {
    const token = ctx.request.body.authorization;
    const pass = ctx.request.body.pass;
    const decodeToken = await jwt_utils.getUserInfo(token);
    //console.log("decodeToken:", decodeToken)
//iat 
//exp 
//const correct = await bcrypt.compare(ctx.request.body.pass, newInfoUser.pass);


    if (decodeToken != -1) {

      if (!verifyPass(pass)) {
        return ctx.send({
          error: "invelid",
        });
      } else {

        if ((decodeToken.exp-decodeToken.iat)>900) {
  const user =await strapi.query("clients").findOne({
    _id: decodeToken.userId,
  })
  if (!(await bcrypt.compare(ctx.request.body.omp, user.pass))) {
    return ctx.send({
      error: "false old Pass",
    });
  }
}


        const hashPassword = await bcrypt.hash(pass, 10);
        
        const test = await strapi.query("clients").update({
          _id: decodeToken.userId,
        },
        {pass : hashPassword}
        );
        console.log('hashPassword:', test.pass ==hashPassword)
        return ctx.send({
          success: "success",
        });
      }
    } else {
      return ctx.send({
        error: "Link expired.",
      });
    }
  },

  // change info user
  changeUserInfo: async(ctx)=>{
 
 
    const  result = await json_schema.changeUserInfo(ctx.request.body)
  

    if(result.error){
      return ctx.send(result)
    }
    else {
      const body = extractInfo(ctx.request.body);
      
      
      const  infouser =  await strapi.query("clients").update({
        _id: result.success.userId,
        status: "valid",
      },body);
      
      if(!!infouser){
      return ctx.send({success:getPublicInfo(infouser)})
      }else{
        return ctx.send({error:"no user found"})
      }
    }

  },

  // Edit email 
  EditEmail:async(ctx)=>{
    
    const email = ctx.request.body.email
    console.log('ctx.request.body:', ctx.request.body)

    const decodeToken = jwt_utils.getUserInfo(ctx.request.body.token);
    if (decodeToken != -1) {
 

      
    if (!(await verifyEmail(email))) {
      return ctx.send({
        error: "email invalid",
      });
    }

    const newInfoUser = await strapi.query("clients").findOne({
      _id: decodeToken.userId,
      status_ne:"blocked",
    });

    const correct = await bcrypt.compare(ctx.request.body.pass, newInfoUser.pass);
    console.log('\n ** pass:', ctx.request.body.pass,"\n **newInfoUser",newInfoUser.pass)
    if (!correct) {
      return ctx.send({
        error: "password invalid",
      });
    }

    const token = jwt_utils.generateTokenForUser(newInfoUser, 60 * 15, {
      email: email.toLowerCase(),
    });

    await sendMeEmailToConfirm(
      newInfoUser.firstname,
      newInfoUser.lastname,
      token,
      email, 
      ctx.request.body.lang
    );
    ctx.send({
      success: email
    });


  }else{
    ctx.send({error:"disconnect"})
  }
  },

  // update info
  updateInfo: async (ctx) => {
    const success = (infoUser) => {
      return ctx.send({
        success: "La modification a bien été enregistrer",
        userInfo: {
          _id: infoUser._id,
          firstname: infoUser.firstname,
          lastname: infoUser.lastname,
          email: infoUser.email,
          phone: infoUser.phone,
          addr: infoUser.addr,
          promo: infoUser.promo,
          status: infoUser.status,
        },
      });
    };

    const disconnect = () => {
      ctx.send({
        error: "disconnect",
      });
    };

    const body = ctx.request.body;
    const form = JSON.parse(body.form);
    const operation = body.operation;

    if (body.token != undefined) {
      const decodeToken = jwt_utils.getUserInfo(body.token);
      if (decodeToken != -1) {
        let infouser = await strapi.query("clients").findOne({
          _id: decodeToken.userId,
          status_gt: -1,
        });
        if (["name", "email", "password"].includes(operation)) {
          const correct = await bcrypt.compare(form.pass, infouser.pass);
          if (!correct) {
            return ctx.send({
              error: "Mot de passe incorrect",
            });
          }
        }
        if (
          operation == "name" &&
          infouser.firstname != form.firstname &&
          infouser.lastname != form.lastname
        ) {
          if (!verifyName(form.firstname) || !verifyName(form.lastname)) {
            return ctx.send({
              error: "le nom et le prénom doit contenir entre 2 et 30 caractères ",
            });
          }
          infouser.firstname = form.firstname;
          infouser.lastname = form.lastname;
          await strapi.query("clients").update({
              _id: decodeToken.userId,
            },
            infouser
          );

          const newInfoUser = await strapi.query("clients").findOne({
            _id: decodeToken.userId,
          });
          return success(newInfoUser);
        } else if (operation == "email" && infouser.email != form.email) {
          if (!(await verifyEmail(form.email))) {
            return ctx.send({
              error: "email invalide ",
            });
          }

          const newInfoUser = await strapi.query("clients").findOne({
            _id: decodeToken.userId,
          });
          const token = jwt_utils.generateTokenForUser(newInfoUser, 60 * 15, {
            email: form.email.toLowerCase(),
          });

          await sendMeEmailToConfirm(
            newInfoUser.firstname,
            newInfoUser.lastname,
            token,
            form.email
          );
          ctx.send({
            success: `un email de confirmation a été envoyer  à ${form.email}`,
          });
        } else if (operation == "password") {
          if (!verifyPass(form.newPass)) {
            return ctx.send({
              error: " Le nouveau mot de passe doit contenir au minimum 8 caractères, une majuscule, un chiffre ",
            });
          }
          const correct = await bcrypt.compare(form.newPass, infouser.pass);
          if (correct) {
            return ctx.send({
              error: " ce mot de passe correspend déjà au votre",
            });
          }

          const hashPassword = await bcrypt.hash(form.newPass, 10);
          infouser.pass = hashPassword;
          await strapi.query("clients").update({
              _id: decodeToken.userId,
            },
            infouser
          );

          return ctx.send({
            response: "success",
          });
        } else if (operation == "phone") {
          if (form.phone.phone.length != 9) {
            return ctx.send({
              error: "Le numero de téléphone doit contenir 9 chiffres",
            });
          }
          infouser.phone = [
            form.phone.iso2,
            "+" + +form.phone.dialCode,
            form.phone.phone,
          ];
          await strapi.query("clients").update({
              _id: decodeToken.userId,
            },
            infouser
          );

          const newInfoUser = await strapi.query("clients").findOne({
            _id: decodeToken.userId,
          });
          return success(newInfoUser);
        } else if (operation == "removePhone") {
          infouser.phone = [];
          await strapi.query("clients").update({
              _id: decodeToken.userId,
            },
            infouser
          );

          const newInfoUser = await strapi.query("clients").findOne({
            _id: decodeToken.userId,
          });
          return success(newInfoUser);
        } else if (operation == "addr") {
          infouser.addr = [
            form.street,
            form.town,
            form.code,
            form.contry.value + ", " + form.contry.label,
          ];

          await strapi.query("clients").update({
              _id: decodeToken.userId,
            },
            infouser
          );

          const newInfoUser = await strapi.query("clients").findOne({
            _id: decodeToken.userId,
          });
          return success(newInfoUser);
        } else if (operation == "removeAddr") {
          infouser.addr = [];
          await strapi.query("clients").update({
              _id: decodeToken.userId,
            },
            infouser
          );

          const newInfoUser = await strapi.query("clients").findOne({
            _id: decodeToken.userId,
          });
          return success(newInfoUser);
        } else {
          ctx.send({
            error: "ces informations sont déjà renseignées ",
          });
        }
      } else {
        disconnect();
      }
    } else {
      disconnect();
    }
  },

  // promo
  promo: async (ctx) => {
    const disconnect = () => {
      ctx.send({
        error: "disconnect",
      });
    };
    const form = JSON.parse(ctx.request.body.form);
    const decodeToken = await jwt_utils.getUserInfo(ctx.request.body.token);

    if (decodeToken == -1) {
      return disconnect();
    }

    const op = ctx.request.body.operation;
    let infoUser = await strapi.query("clients").findOne({
      _id: decodeToken.userId,
    });

    if ((op == "edit" && infoUser.promo.value != 1) || infoUser == null) {
      return disconnect();
    }

    if (form.code) {
      const existentCode = await strapi.query("clients").model.findOne({
        "promo.code": form.code.toUpperCase(),
        _id: {
          $ne: infoUser._id,
        },
      });
      if (existentCode != null) {
        return ctx.send({
          error: `le code créateur ${form.code} existe déjà`,
        });
      }
    }
    const newPromo = {
      value: op == "ask" ? 0 : 1,
      media: form.media ? form.media : "-",
      payment: form.payment ? form.payment : "-",
      code: form.code ? form.code.toUpperCase() : infoUser._id.toUpperCase(),
      solde: infoUser.promo.solde ? infoUser.promo.solde : 10,
      benef: infoUser.promo.benef ? infoUser.promo.benef : 10,
      money: {
        actual: infoUser.promo.money.actual ? infoUser.promo.money.actual : 0,
        total: infoUser.promo.money.total ? infoUser.promo.money.total : 0,
        askToPay: infoUser.promo.money.askToPay ?
          infoUser.promo.money.askToPay :
          false,
      },
    };
    infoUser.promo = newPromo;
    await strapi.query("clients").update({
      _id: infoUser._id,
    }, {
      $set: {
        promo: newPromo,
      },
    });

    return ctx.send({
      success: newPromo,
    });
  },

  // see code pursentage
  promoPurcent: async (ctx) => {
    const code = ctx.params.code;
    const zero = () => {
      return ctx.send({
        reduction: 0,
      });
    };
    if (code) {
      const infoUser = await strapi.query("clients").model.findOne({
        "promo.value": 1,
        "promo.code": code,
      });

      if (infoUser) {
        return ctx.send({
          reduction: infoUser.promo.solde,
        });
      } else {
        return zero();
      }
    } else {
      return zero();
    }
  },

  // payme
  promoPayMe: async (ctx) => {
    const decodeToken = await jwt_utils.getUserInfo(ctx.request.body.token);

    let infoUser = await strapi.query("clients").findOne({
      _id: decodeToken.userId,
    });
    if (
      infoUser.promo.money.actual > 50 ||
      infoUser.promo.money.askToPay == false
    ) {
      await strapi.query("clients").update({
        _id: infoUser._id,
      }, {
        $set: {
          "promo.money.askToPay": true,
        },
      });
      return ctx.send({
        response: "success",
      });
    }
  },

  // eet Affiliation Info (Ask to pau  + affiliation demande  )
  getAffiliationProgramInfo: async (ctx) => {
    const disconnect = () => {
      return ctx.send({
        error: "disconnect",
      });
    };

    const token = ctx.params.token;
    const decode_token = await jwt_utils.getUserInfo(token);

    if (decode_token == -1) {
      return disconnect();
    }
    const adminExist = await strapi.query("clients").findOne({
      _id: decode_token.userId,
      status: 1,
    });
    if (adminExist) {
      const Affiliates = await strapi.query("clients").model.find({
          "promo.value": {
            $gt: -1,
          },
        },
        ["_id", "firstname", "lastname", "email", "phone", "promo"]
      );

      const AskToPay = await strapi.query("clients").model.find({
          "promo.money.askToPay": true,
        },
        ["_id", "firstname", "lastname", "email", "phone", "promo"]
      );
      return ctx.send({
        Affiliates: Affiliates,
        AskToPay: AskToPay,
      });
    } else {
      return disconnect();
    }
  },
  //  admin  change   user
  adminChengeUser: async (ctx) => {
    const disconnect = () => {
      return ctx.send({
        error: "disconnect",
      });
    };

    const op = ctx.request.body.op;
    const token = ctx.request.body.token;
    const idUser = ctx.request.body.idUser;
    const decode_token = await jwt_utils.getUserInfo(JSON.parse(token));

    if (decode_token == -1) {
      return disconnect();
    }
    const adminExist = await strapi.query("clients").findOne({
      _id: decode_token.userId,
      status: 1,
    });
    if (adminExist) {
      const user = await strapi.query("clients").findOne({
        _id: idUser,
      });

      if (user) {
        if (op == "delete" || op == "accept") {
          await strapi.query("clients").update({
            _id: user._id,
          }, {
            $set: {
              "promo.value": op == "delete" ? -1 : 1,
            },
          });
        } else if (op == "pay") {
          await strapi.query("clients").update({
            _id: user._id,
          }, {
            $set: {
              "promo.money.actual": 0,
              "promo.money.askToPay": false,
            },
          });
        }
      }

      const Affiliates = await strapi.query("clients").model.find({
          "promo.value": {
            $gt: -1,
          },
        },
        ["_id", "firstname", "lastname", "email", "phone", "promo"]
      );

      const AskToPay = await strapi.query("clients").model.find({
          "promo.money.askToPay": true,
        },
        ["_id", "firstname", "lastname", "email", "phone", "promo"]
      );
      return ctx.send({
        Affiliates: Affiliates,
        AskToPay: AskToPay,
      });
    } else {
      return disconnect();
    }
  },
  sendNewsletter: async (ctx) => {
    const disconnect = () => {
      return ctx.send({
        error: "disconnect",
      });
    };

    const token = ctx.request.body.token;
    const obj = ctx.request.body.obj;
    const bodyMail = ctx.request.body.bodyMail;

    const decode_token = await jwt_utils.getUserInfo(token);

    if (decode_token == -1) {
      return disconnect();
    }

    const adminExist = await strapi.query("clients").findOne({
      _id: decode_token.userId,
      status: 1,
    });
    if (adminExist) {
      const allUsersEmails = await strapi
        .query("clients")
        .model.find({}, ["email"]);
      allUsersEmails.map((i) =>
        sendEmail(i.email, obj, bodyMail, config.email.newsletter)
      );
      return ctx.send({
        success: `email envoyé à ${allUsersEmails.length} Clients`,
      });
    } else {
      return disconnect();
    }
  },
};



/*

 ["Adrar",
"Chlef",
"Laghouat",
"Oum El Bouaghi	",
"Batna	",
"Béjaïa",
"Biskra",
"Béchar",
"Blida	",
"Bouira",
"Tamanrasset",
"Tébessa",
"Tlemcen",
"Tiaret",
"Tizi Ouzou",
"Alger",
"Djelfa",
"Jijel",
"Sétif	",
"Saïda",
"Skikda",
"Sidi Bel Abbès",
"Annaba",
"Guelma",
"Constantine",
"Médéa",
"Mostaganem",
"M'Sila",
"Mascara",
"Ouargla",
"Oran	",
"El Bayadh",
"Illizi",
"Bordj Bou Arreridj",
"Boumerdès",
"El Tarf",
"Tindouf",
"Tissemsilt",
"El Oued",
"Khenchela",
"Souk Ahras",
"Tipaza",
"Mila",
"Aïn Defla",
"Naâma",
"Aïn Témouchent",
"Ghardaïa",
"Relizane",
"Timimoun",
"Bordj Badji Mokhtar",
"Ouled Djellal",
"Béni Abbès",
"In Salah",
"In Guezzam",
"Touggourt",
"Djanet",
"El M'Ghair",
"El Meniaa"]
 
*/
