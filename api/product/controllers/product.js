
module.exports = {
  
  // homePage
  homepage:async (ctx)=>{
    
    const Sliders = await strapi.query("slider").find({ _sort:'index:asc'});
    return ctx.send({slider:Sliders});
  },
};
