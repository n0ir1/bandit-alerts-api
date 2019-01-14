export const config = {
  jwt: {
    secret: 'secret',
    accessTokenExpires: '30s',
    refreshTokenExpires: '1m',
  },
  dbUrl: 'postgresql://postgres:IbSkQf3Ge1Ei@localhost:5432/bandit-alerts',
  session: {
    secret: 'secret-key',
  },
};
