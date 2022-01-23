module.exports = ({ env }) => ({
  connection: {
    client: 'mysql',
    connection: {
      host: env('DATABASE_HOST', 'mysql-66357-0.cloudclusters.net'),
      port: env.int('DATABASE_PORT', 15388),
      database: env('DATABASE_NAME', 'server'),
      user: env('DATABASE_USERNAME', 'admin'),
      password: env('DATABASE_PASSWORD', '1ZIeoGeO'),
      ssl: env.bool('DATABASE_SSL', false),
    },
  },
});
