module.exports = {
    routes: [
      {
        method: 'POST',
        path: '/forClientOage',
        handler: 'product.forClientOage',
      },
      {
        method: 'GET',
        path: '/product/find',
        handler: 'product.find',
      }, 
      {
        method: 'POST',
        path: '/porduct/postArticle',
        handler: 'product.postArticle',
      }
    ]
}