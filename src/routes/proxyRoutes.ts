import express from 'express';
import main from '../proxy/main';

const ProxyRoutes: express.Router = express.Router();

ProxyRoutes.get('/*', main.main);
ProxyRoutes.post('/*', main.main);
ProxyRoutes.put('/*', main.main);
ProxyRoutes.delete('/*', main.main);


export default ProxyRoutes;
