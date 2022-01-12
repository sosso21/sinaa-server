/*

npm i -S  fs 
npm i -S  bcrypt 
npm i -S  jsonwebtoken
npm i -S  nodemailer  
 npm i -S nodemailer-sendinblue-transport

*/

const {
  verifyEmail,
  verifyPass,
  verifyName,
} = require("../../functions/emailPassVerificator");
const bcrypt = require("bcrypt");
const jwt_utils = require("../../functions/jwt.utils.js");
const {
  sendMeEmailToConfirm,
  sendMeEmailToResetPassowrd,
} = require("../../functions/sendMeEmailToConfirm.js");
const config = require("../../functions/config");
const json_schema = require("../../functions/schema");

const getPublicInfo = ({ ...obj
}) => {
  return {...obj,pass:""};
};

const extractInfo = ({ token, ...infos }) => infos;

module.exports = {


  test: async (ctx) => {
    
    const query =    await strapi.entityService.update("api::client.client",2,{ 
     
      populate: '*',
      data: {
        products: [
          {
            id: 1,
          }
        ]
      }
    });
 
    ctx.send({
      test: query 
    });
  },
  //  resugster
  signup: async (ctx) => {
    const { username, firstname, lastname, email, pass, lang } =
      ctx.request.body;
      
    if (
      !verifyName(firstname) ||
      !verifyName(lastname) ||
      !verifyName(username) ||
      username.includes(" ")
    ) {
      return ctx.send({
        error: "short name",
      });
    }
    if (!verifyEmail(email)) {
      
      return ctx.send({
        error: "email invalid",
      });
    }
    if (!verifyPass(pass)) {
      return ctx.send({
        error: "pass short",
      });
    }
    const exist = await strapi.db.query("api::client.client").count({
      where: {
        $or: [
          {
            email: email.toLowerCase(),
          },
          {
            username: username.toLowerCase(),
          },
        ],
      },
    });

    if (!!exist) {
      return ctx.send({
        error: "info already exists",
      });
    }

    const hashPasword = await bcrypt.hash(pass, 10);

    const savedUser = await strapi.db.query("api::client.client").create({
      data: {
        username: username.toLowerCase(),
        firstname: firstname.toLowerCase(),
        lastname: lastname.toLowerCase(),
        email: email.toLowerCase(),
        pass: hashPasword,
        status: "waiting",
        sexe: "none",
      },
    });

    const token = jwt_utils.generateTokenForUser(savedUser, 60 * 15, {
      email: savedUser.email,
    });

    if (await sendMeEmailToConfirm(firstname, lastname, token, email, lang)) {
      ctx.send({
        success: `email sended`,
      });
    }
  },

  // connect
  connect: async (ctx) => {
    const ISO = ctx.request.header["user-agent"];
    const error = (error = "email pass incorrect") => {
      ctx.send({
        error: error,
      });
    };

    const success = async (infoUserAll) => {
      const infoUser = getPublicInfo(infoUserAll);
      const token = jwt_utils.generateTokenForUser(infoUser, 3600 * 24 * 90, {
        ISO: ISO,
      });

      await strapi.db.query("api::client.client").update({
        where: {
          id: infoUserAll.id,
        },
        data: {
          lastConnect: new Date().getTime(),
        }, populate:true,
      });

      return ctx.send({
        token: token,
        userInfo: {
          ...infoUser,
          pass: "*",
        },
      });
    };

    if (!!ctx.request.body.email && !!ctx.request.body.pass) {
      const email = ctx.request.body.email.toLowerCase();
      const pass = ctx.request.body.pass;
      const infoUser = await strapi.db.query("api::client.client").findOne({
        where: {
          email: email,
        },
        populate: true,
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
    } else if (!!ctx.request.body.token) {
      const decodeToken = jwt_utils.getUserInfo(ctx.request.body.token);
      if (decodeToken != -1 && decodeToken.ISO == ISO) {
        const infouser = await strapi.db.query("api::client.client").findOne({
          where: {
            id: decodeToken.userId,
            $or: [
              {
                status: "valid",
              },
              {
                status: "confirmed",
              },
            ],
          },
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

  // confirm email
  confirmEmailGet: async (ctx) => {
    const token = ctx.params.token;
    const auth = jwt_utils.getUserInfo(token);

    if (auth != -1) {
      
      const authUser = await strapi.db.query("api::client.client").update({
        where: {
          // id: auth.userId,
          status: {
            $ne: "blocked",
          },
        },
        data: {
          email: auth.email,
          status: auth.status == "waiting" ? "valid" : auth.status,
        },
      });

      if (authUser == null) {
        return ctx.send("<h1>error link, please retry </h1>");
      } else {
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

    const user = await strapi.db.query("api::client.client").findOne({
      where: {
        email: email,
      },
    });

    if (!!user) {
      if (user.status == "blocked") {
        return ctx.send({
          error: "blocked",
        });
      } else if (user.status == "valid") {
        return ctx.send({
          success: "valid",
        });
      } else {
        const token = jwt_utils.generateTokenForUser(user, 60 * 15, {
          email: user.email,
        });

        if (
          await sendMeEmailToConfirm(
            user.firstname,
            user.lastname,
            token,
            user.email,
            lang
          )
        ) {
          return ctx.send({
            success: "sended",
          });
        }
      }
    } else {
      return ctx.send({
        error: "user not found",
      });
    }
  },

  // send email to reset password
  sendEmailToResetPassword: async (ctx) => {
    const email = ctx.params.langNEmail.split("%%")[1];
    const lang = ctx.params.langNEmail.split("%%")[0];

    const infoUser = await strapi.db.query("api::client.client").findOne({
      where: {
        email: email,
      },
    });
    
    if (infoUser != null) {
      const token = await jwt_utils.generateTokenForUser(
        {
          id: infoUser.id,
          status: infoUser.status,
        },
        60 * 15
      );
      //--
      const sent = await sendMeEmailToResetPassowrd(
        lang,
        token,
        infoUser.email,
        infoUser
      );
      if (sent) {
        ctx.send({
          response: "success",
        });
      }
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
        if (decodeToken.exp - decodeToken.iat > 900) {
          const user = await strapi.db.query("api::client.client").findOne({
            where: {
              id: decodeToken.userId,
            },
          });
          if (!(await bcrypt.compare(ctx.request.body.omp, user.pass))) {
            return ctx.send({
              error: "false old Pass",
            });
          }
        }

        const hashPassword = await bcrypt.hash(pass, 10);

        const test = await strapi.db.query("api::client.client").update({
          where: {
            id: decodeToken.userId,
          },
          data: {
            pass: hashPassword,
          },
        });
        
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
  changeUserInfo: async (ctx) => {
    
  const body = JSON.parse(ctx.request.body.str)
    const result = await json_schema.changeUserInfo(body);
    

    if (result.error) {
      return ctx.send(result);
    } else { 
      const init =   await strapi.entityService.findOne("api::client.client",result.success.userId,{ 
        populate: '*'
      });
 
 
let data ={}
const filter = ["token","pass",
"id",
"pass",
"status",
"lastConnect",
"createdAt",
"updatedAt",
"publishedAt",
"flow",
"followers",
"products",
"likers",
"createdBy",
"updatedBy"
]

for (const key in body) {
    const value  = body[key]
   if (!!value.length && !(filter).includes(key) && init[key] != body[key] && !( key =="identity_card" && init.status == "confirmed" )) {
      data[key]=value
    }
  }
  if (!!data.identity_card) {
    data ={...data,waiting_to_confirm:1}
  }
  
     const infouser = await strapi.entityService.update("api::client.client",result.success.userId,{ 
      populate: '*',
      data: data
    });
    
       
    if (!!infouser) {
      
        return ctx.send({
          success:getPublicInfo(infouser),
        });
      } else {
        return ctx.send({
          error: "no user found",
        });
      }
    }
  },

  // Edit email
  EditEmail: async (ctx) => {
    const email = ctx.request.body.email;
    

    const decodeToken = jwt_utils.getUserInfo(ctx.request.body.token);
    if (decodeToken != -1) {
      if (!(await verifyEmail(email))) {
        return ctx.send({
          error: "email invalid",
        });
      }

      const newInfoUser = await strapi.db.query("api::client.client").findOne({
        where: {
          id: decodeToken.userId,
          status: {
            $ne: "blocked",
          },
        },
      });

      const correct = await bcrypt.compare(
        ctx.request.body.pass,
        newInfoUser.pass
      );

      if (!correct) {
        return ctx.send({
          error: "password invalid",
        });
      }

      const token = jwt_utils.generateTokenForUser(newInfoUser, 60 * 15, {
        email: email.toLowerCase(),
      });

      if (
        await sendMeEmailToConfirm(
          newInfoUser.firstname,
          newInfoUser.lastname,
          token,
          email,
          ctx.request.body.lang
        )
      ) {
        ctx.send({
          success: email,
        });
      }
    } else {
      ctx.send({
        error: "disconnect",
      });
    }
  },
};
 