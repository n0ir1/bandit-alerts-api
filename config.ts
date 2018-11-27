export const config = {
  jwt: {
    secret: 'secret',
    expiresIn: '1h',
  },
  dbUrl: 'postgresql://postgres:IbSkQf3Ge1Ei@localhost:5432/bandit-alerts',
  session: {
    secret: 'secret-key',
  },
};
