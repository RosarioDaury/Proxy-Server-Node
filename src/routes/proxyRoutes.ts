import express from 'express';
import main from '../proxy/main';
import AuthController from '../controller/authToken';

const ProxyRoutes: express.Router = express.Router();

ProxyRoutes.get('/*', AuthController.authRequest, main.main);
ProxyRoutes.post('/*', AuthController.authRequest, main.main);
ProxyRoutes.put('/*', AuthController.authRequest, main.main);
ProxyRoutes.delete('/*', AuthController.authRequest, main.main);


export default ProxyRoutes;
