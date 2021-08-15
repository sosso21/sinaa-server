
module.exports = {
  
  // homePage
  homepage:async (ctx)=>{
    
    const Sliders = await strapi.query("slider").find({ _sort:'index:asc'});
    const category = await strapi.query("category").find({ _sort:'slug:asc'});
    return ctx.send({slider:Sliders,category:category});
  },
};
