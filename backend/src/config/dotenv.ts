export const dotenv = {
  database: {
    user: process.env.ORACLEDB_USER ?? 'system',
    password: process.env.ORACLEDB_PASSWORD ?? 'parola',
    connectString: process.env.ORACLEDB_CONNECTIONSTRING ?? 'localhost/orclpdb1',
    poolMin: +(process.env.ORACLEDB_POOL_MIN ?? 1),
    poolMax: +(process.env.ORACLEDB_POOL_MAX ?? 10),
  },
  server: {
    port: +(process.env.PORT ?? 8080),
    nodeEnv: process.env.NODE_ENV ?? 'development',
    nodeFrontendPath: process.env.NODE_FRONEND_PATH ?? '../../frontend/build',
  },
  auth: {
    secret: process.env.AUTH_SECRET ?? 'secret',
    token: process.env.AUTH_TOKEN ?? 'auth-token',
    rounds: +(process.env.AUTH_ROUNDS ?? 10),
  },
};
