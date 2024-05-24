import express from 'express';
import Logger from './src/utils/logger';
import 'dotenv/config';
import ProfixConfigRouter from './src/routes/proxyConfigRoutes';
import ProxyRoutes from './src/routes/proxyRoutes';
import bodyParser from 'body-parser';

const server: express.Application = express();

server.use(bodyParser.json())
server.use('/config', ProfixConfigRouter);
server.use(ProxyRoutes);

server.listen(Number(process.env.PORT), String(process.env.HOST), () => {
    Logger.success(`SERVER IS UP ON: ${process.env.PROTOCOL}://${process.env.HOST}:${process.env.PORT}`);
})