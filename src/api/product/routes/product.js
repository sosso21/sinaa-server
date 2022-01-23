module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forClientPage',
        handler: 'product.forClientPage',
      },
      {
        method: 'GET',
        path: '/product/findId',
        handler: 'product.findId',
      }, 
      {
        method: 'GET',
        path: '/product/findOne/:id',
        handler: 'product.findOne',
      }, 
      {
        method: 'GET',
        path: '/product/addView/:id',
        handler: 'product.addView',
      }, 
      {
        method: 'POST',
        path: '/porduct/postArticle',
        handler: 'product.postArticle',
      },
      {
        method: 'POST',
        path: '/porduct/EditArticle',
        handler: 'product.EditArticle',
      },
      {
        method: 'GET',
        path: '/porduct/findhomepage',
        handler: 'product.findHomePage',
      }
    ]
}