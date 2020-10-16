export const dotenv = {
  database: {
    user: process.env.ORACLEDB_USER ?? 'system',
    password: process.env.ORACLEDB_PASSWORD ?? 'parola',
    connectString: process.env.ORACLEDB_CONNECTIONSTRING ?? 'localhost/orclpdb1',
    poolMin: +(process.env.ORACLEDB_POOL_MIN ?? 1),
    poolMax: +(process.env.ORACLEDB_POOL_MAX ?? 10),
  },
  server: {
    httpPort: +(process.env.HTTP_PORT ?? 3000),
    httpsPort: +(process.env.HTTPS_PORT ?? 3001),
  }
};
