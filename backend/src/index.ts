import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import auth from './auth';
import api from './api';
import bodyParser from 'body-parser';
import { dotenv } from './config';
import express from 'express';
import * as fs from 'fs';
import https from 'https';
import http from 'http';

const startServer = () => {
  const app = express();

  // const privateKey = fs.readFileSync('sslcert/server.key', 'utf8');
  // const certificate = fs.readFileSync('sslcert/server.crt', 'utf8');

  // const credentials = { key: privateKey, cert: certificate };

  process.on('uncaughtException', () => shutdown());
  process.on('SIGTERM', () => shutdown());
  process.on('SIGINT', () => shutdown());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.get('/', (req, res) => res.status(200).send('ok'));

  app.use('/auth', auth());
  app.use('/api', api());

  const httpServer = http.createServer(app);
  // const httpsServer = https.createServer(credentials, app);

  httpServer.listen(dotenv.server.httpPort);
  // httpsServer.listen(dotenv.server.httpsPort);

  const shutdown = () => {
    httpServer.close();
    // httpsServer.close();
  };
};

oracledbWrapper.createPool(dotenv.database).then(() => {
  startServer();
});
