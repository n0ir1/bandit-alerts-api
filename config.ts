export const config = {
  jwt: {
    secret: 'secret',
    accessTokenExpires: '10m',
    refreshTokenExpires: '7d',
  },
  dbUrl: 'postgresql://postgres:IbSkQf3Ge1Ei@localhost:5432/bandit-alerts',
  session: {
    secret: 'secret-key',
  },
};
