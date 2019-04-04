export const config = {
  jwt: {
    secret: 'secret',
    accessTokenExpires: '10m',
    refreshTokenExpires: '7d',
  },
  dbUrl:
    process.env.DB_URL ||
    'postgresql://postgres:IbSkQf3Ge1Ei@localhost:5432/bandit-alerts',
  session: {
    secret: 'secret-key',
  },
};
