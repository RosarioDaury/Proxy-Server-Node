import { readFileSync, writeFileSync } from "fs"
import 'dotenv/config';
import Logger from "./logger";

export const readJson = async (): Promise<Iservice[] | null> => {
    try {
        const json: string = readFileSync(String(process.env.PROXY_CONFIG_ROUTE), 'utf-8');
        const result: Iservice[] = JSON.parse(json);
        return result;
    } catch(err) {
        Logger.error(err);
        return null
    }
}

export const writeJson = async (object: Iservice): Promise<void> => {
    try {
        let json = await readJson();
        if(json) {
            json.push(object);            
            writeFileSync(String(process.env.PROXY_CONFIG_ROUTE), JSON.stringify(json, null, 2));
            
            Logger.info('JSON PROXY CONFIG FILE UPDATED');
        }
    } catch (err) {
        Logger.error(err);
    }
}

export const deleteFromJson = async (subdomain: string): Promise<void> => {
    try {
        let json = await readJson();
        if(json) {
            json = json.filter(el => el.subdomain != subdomain);
            writeFileSync(String(process.env.PROXY_CONFIG_ROUTE), JSON.stringify(json, null, 2));
            
            Logger.info('JSON PROXY CONFIG FILE UPDATED');
        }
    } catch(err) {
        Logger.error(err);
    }
}

