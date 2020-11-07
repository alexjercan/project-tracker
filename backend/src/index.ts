import * as oracledbWrapper from '@alexjercan/oracledb-wrapper';
import auth from './auth';
import api from './api';
import bodyParser from 'body-parser';
import { dotenv } from './config';
import express from 'express';
import http from 'http';
import path from 'path';

const startServer = () => {
  const app = express();

  process.on('uncaughtException', () => shutdown());
  process.on('SIGTERM', () => shutdown());
  process.on('SIGINT', () => shutdown());

  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  app.use('/auth', auth());
  app.use('/api', api());

  app.get('/ok', (req, res) => res.status(200).send('ok'));

  if (dotenv.server.nodeEnv === 'production' || dotenv.server.nodeEnv === 'staging') {
    app.use(express.static(path.join(__dirname, dotenv.server.nodeFrontendPath)));

    app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, dotenv.server.nodeFrontendPath, 'index.html'));
    });
  } else {
    app.get('/', (req, res) => res.status(200).send('ok'));
  }

  const httpServer = http.createServer(app);
  httpServer.listen(dotenv.server.port);

  // tslint:disable-next-line: no-console
  console.log(`Listening on port ${dotenv.server.port}`);

  const shutdown = () => {
    httpServer.close();
  };
};

oracledbWrapper.createPool(dotenv.database).then(() => {
  startServer();
});
