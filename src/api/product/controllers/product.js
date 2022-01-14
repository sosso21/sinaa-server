"use strict";

/**
 *  category controller
 */

const bcrypt = require("bcrypt");
const jwt_utils = require("../../functions/jwt.utils.js");
const models = require("../content-types/product/schema.json").attributes;

module.exports = {
  find: async (ctx) => {
    ctx.send(
      await strapi.db.query("api::product.product").findMany({
        populate: true,
      })
    );
  },
  forClientOage: async (ctx) => {
    const decodeToken = jwt_utils.getUserInfo(ctx.request.body.token);
    if (decodeToken != -1) {
      const products = await strapi.db.query("api::product.product").findMany({
        populate: true,
      });

      xtx.send({
        products: products,
        //likes: likes,
      });
    } else {
      ctx.send({
        error: "disconnect",
      });
    }
  },
  postArticle: async (ctx) => {
    const body = JSON.parse(ctx.request.body.str);

    const decodeToken = jwt_utils.getUserInfo(body.token);
    if (decodeToken != -1) {
     
      let data = [];
      for (const key in body) {
        if (!!models[key] && !!body[key].length) {
          data[key] = body[key];
        }
      }
      
      const products = await strapi.entityService.create(
        "api::product.product",
        {
          populate: "*",
          data: {
            ...data,
            status: "published",
            category:body.category,
            author: {
              id: decodeToken.userId,
            },
          },
        }
      );
 
      ctx.send({
        body: products,
      });
    } else {
      ctx.send({
        error: "eroor",
      });
    }
  },
};
/*
git init
git add .
git commit -m "first commit"
git remote add origin https://github.com/sosso21/sinaa-server.git
git push -u origin master

  */
