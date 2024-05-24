import { Response, Request } from "express";
import { deleteFromJson, readJson, writeJson } from "../utils/jsonModifier";
import Logger from "../utils/logger";


class ProxyConfigController {
    async getConfig(req: Request, res: Response) {
        try {
            const config = await readJson();
            return res.send(config);
        } catch(err) {
            Logger.error(err);
            return res.send('ERROR GETTING PROXY CONFIG').status(500);
        }
    }

    async addRouteToProxyConfig(req: IAddRouteConfigRequest, res: Response) {
        try {
            await writeJson(req.body);
            return res.send('JSON PROXY CONFIG FILE UPDATED');
        } catch(err) {
            Logger.error(err);
            return res.send('ERROR ADDING ROUTE TO PROXY CONFIG').status(500);
        }
    }

    async deleteRouteFromProxyConfig (req: ICustomRequest<{subdomain: string}>, res: Response) {
        try {
            await deleteFromJson(req.body.subdomain);
            return res.send('JSON PROXY CONFIG FILE UPDATED');
        } catch(err) {
            Logger.error(err);
            return res.send('ERROR DELETING ROUTE FROM PROXY CONFIG').status(500);
        }
    }
}

export default new ProxyConfigController();