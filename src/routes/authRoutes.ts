import AuthController from '../controller/authToken';
import express from 'express';

const AuthRoutes: express.Router = express.Router();

AuthRoutes.get('/generate', AuthController.generateToken);

export default AuthRoutes;