'use strict';

/**
 *  category controller
 */
 
module.exports ={
    forClientOage:async (ctx)=>{
        ctx.send(await strapi.db.query("api::product.product").findMany({
            populate: true}))
        

    }
};

 