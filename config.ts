export const config = {
  jwt: {
    secret: 'secret',
    accessTokenExpires: '10m',
    refreshTokenExpires: '7d',
  },
  dbUrl: process.env.DB_URL || '',
  session: {
    secret: 'secret-key',
  },
};
