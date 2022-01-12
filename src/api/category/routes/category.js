module.exports = {
    routes: [
      {
        method: 'GET',
        path: '/category/find',
        handler: 'category.find',
      },
      {
        method: 'GET',
        path: '/category/generate',
        handler: 'category.generate',
      }
    ]
}