"use strict";

/**
 *  category controller
 */

const bcrypt = require("bcrypt");
const jwt_utils = require("../../functions/jwt.utils.js");
const models = require("../content-types/product/schema.json").attributes;

module.exports = {
  findId: async (ctx) => {
    ctx.send(
      await strapi.db.query("api::product.product").findMany({
        select:"id",
        where: {
          status: "published",
        },
      })
    );
  },
  findOne: async (ctx) => {
    const id = ctx.params.id;
    
const  product = await strapi.db.query("api::product.product").findOne({
  populate: true,
  where: {
    id: id,
    status: "published",
  },
})
const author = await strapi.db.query("api::client.client").findOne({
  populate: true,
  where: {
    id: product.author.id,
  },
})

    ctx.send(
      {...product,author:author}
    );
  },
  addView: async(ctx)=>{

    const id = ctx.params.id;
    /*
    const phones =  await strapi.entityService.update(
      "api::product.product",1,{
     
    })
    */
    
    ctx.send(id  );

  },
  forClientPage: async (ctx) => {
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
      const banned = [
        "id",
        "status",
        "token",
        "view",
        "like",
        "search",
        "reported",
        "reports",
        "author",
        "likes",
      ];

      for (const key in body) {
        if (!!models[key] && ![...banned].includes(key) && !!body[key] &&!!body[key].length) {
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
            category: body.category,
            author: {
              id: decodeToken.userId,
            },
          },
        }
      );
      
      ctx.send({
        success: products,
      });
    } else {
      ctx.send({
        error: "eroor",
      });
    }
  },
  EditArticle: async (ctx) => {
    const body = JSON.parse(ctx.request.body.str);

    const decodeToken = jwt_utils.getUserInfo(body.token);
    if (decodeToken != -1 && body.author.id ==decodeToken.userId ) {
      let data = [];
      const banned = [
        "id",
        "status",
        "token",
        "view",
        "like",
        "search",
        "reported",
        "reports",
        "author",
        "likes",
      ];
 

      for (const key in body) {
        if (!!models[key] && ![...banned].includes(key) && !!body[key] &&!!body[key].length) {
          data[key] = body[key];
        }
      }
 
      const products = await strapi.entityService.update(
        "api::product.product",body.id,
        {
          populate: "*",
          data: {
            ...data,
            category: body.category,
            
          },
        }
        );
        
      ctx.send({
        success: products,
      });
    } else {
      ctx.send({
        error: "eroor",
      });
    }
  },
  findHomePage:async(ctx)=>{
    const product =  await strapi.db.query("api::product.product").findMany({
      populate: true,
      where: {
        status: "published",
        category:{home:true}
      },
    })

    const category =  await strapi.db.query("api::category.category").findMany()
    
    const slider =  await strapi.db.query("api::slider.slider").findMany();
    
    ctx.send({product:product,category:category,slider:slider})
  },
}; 