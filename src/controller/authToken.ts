import { Response, Request, NextFunction } from "express";
import Logger from "../utils/logger";
import 'dotenv/config';
import jwt from 'jsonwebtoken';
import { readJsonUsers } from "../utils/jsonModifier";

export default class AuthController {

    // INDEPENDENT ROUTE
    static async generateToken(req: Request, res: Response) {
        try {
            const {
                username,
                password
            } = req.headers;

            const users = await readJsonUsers();
            if(users && users.length > 0) {
                const isValid = users.filter(el => el.username == username && el.password == password);

                if(isValid.length > 0) {
                    const token = jwt.sign(isValid[0], String(process.env.JWT_SECRET_KEY), {expiresIn: '1hr'})
                    return res.status(200).send(token);
                }
            }

            return res.status(403).send('NON ACCESS');
        } catch(err) {
            Logger.error(err);
            return res.status(500).send(err);
        }
    }

    // USED AS A MIDDLEWARE
    static async authRequest(req: Request, res: Response, next: NextFunction) {
        try {
            const {token} = req.headers;
            if(token) {
                jwt.verify(String(token), String(process.env.JWT_SECRET_KEY), (err, user) => {
                    if(err) return res.status(403).send("NON ACCESS");
                    next();
                });
            } else {
                return res.status(403).send("NON ACCESS");      
            }
        } catch(err) {  
            Logger.error(err);
            return res.status(500).send(err);
        }
    }
}   