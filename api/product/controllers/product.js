const SortProduct = (product) => {
  /*
  ** view 1
  ** Search 1
  ** like 2
  ** lastConnect 3
  ** createdAt 4
  */

  const GetSortOrder = (prop) => {
    return (a, b) => {

      if (a[prop] > b[prop]) {
        return 1;
      } else if (a[prop] < b[prop]) {
        return -1;
      }
      return 0;
    }
  }
  return product.sort(GetSortOrder("view")).sort(GetSortOrder("Search")).sort(GetSortOrder("like")).sort(GetSortOrder("lastConnect")).sort(GetSortOrder("createdAt"))

}


module.exports = {

  // homePage
  homepage: async (ctx) => {

    const Sliders = await strapi.query("slider").find({
      _sort: 'index:asc'
    });
    const category = await strapi.query("category").find({
      _sort: 'slug:asc'
    });
    const product = await strapi.query("product").find({
      "status": "published",
      _limit: 1000,
      _sort: 'createdAt:asc'
    });

    return ctx.send({
      slider: Sliders,
      category: category,
      product:SortProduct(product)
    });


  },
  findAll: async (ctx) => {



    const product = await strapi.query("product").model.find({
      _limit: 10 000
    }, {
      _sort: 'lastConnect:asc'
    });


  }
};
