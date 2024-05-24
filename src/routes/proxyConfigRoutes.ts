import proxyConfig from '../controller/proxyConfig';
import express from 'express';

const ProxyConfigRouter: express.Router = express.Router();

ProxyConfigRouter.get('/get', proxyConfig.getConfig);
ProxyConfigRouter.post('/add', proxyConfig.addRouteToProxyConfig);
ProxyConfigRouter.delete('/delete', proxyConfig.deleteRouteFromProxyConfig);

export default ProxyConfigRouter;