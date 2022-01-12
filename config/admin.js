module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'ef303e684550f9c491490fa71b206c43'),
  },
});
