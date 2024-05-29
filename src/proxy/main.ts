import { readJson } from "../utils/jsonModifier";
import Logger from "../utils/logger";
import { Request, Response } from 'express';


interface ResponseProxyMethod {
    response: Record<string, any>,
    contentType: string
}

interface ICached {
    url: string,
    response: any
}

class ProxyClass {
    proxyConfiguration: Iservice[] | null = null;
    cached: Array<ICached> = [];

    constructor() {
        this.setUp();
    }

    private async setUp() {
        try {
            // GET THE PROXY CONFIGURATION FROM JSON FILE
            this.proxyConfiguration = await readJson();
        } catch(err) {
            Logger.error(err);
        }
    }


    main = async (req: Request, res: Response) => {
        try {
            let response: ResponseProxyMethod;
            const {hostname, method, originalUrl, protocol, headers} = req;
            const subdomain: string = hostname.split('.')[0];
            const domain = this.proxyConfiguration?.filter(el => el.subdomain == subdomain)[0]?.route || null;

            if(!domain) {
                return res.status(404).send('NOT FOUND')
            }

            const url =`${protocol}://${domain}${originalUrl}`;

            switch(method) {
                case 'GET': 
                    response = await this.GET(url, headers)
                    break;
                case 'POST': 
                    response = await this.POST(url, headers)
                    break;
                case 'PUT': 
                    response = await this.PUT(url, headers, {})
                    break;
                case 'DEL': 
                    response = await this.DELETE(url, headers, {})
                    break;
                default:
                    throw Error('INVALID METHOD');
            }
            res.set('content-type', response.contentType);
            return res.send(response.response);
        } catch(err) {
            Logger.error(err);
            return res.status(500).send('PROXY ERROR');
        }
    }

    private GET = async (url: string, headers: Record<string, any>): Promise<ResponseProxyMethod> => {
        try {
            //* WHEN RESPONSES ARE CACHED
            let cached: ICached | null = this.cachingGet(url);
            if(cached) return {response: cached.response, contentType: ''}

            //* WHEN RESPONSES ARE NOT CACHED
            let response: any = await fetch(url, { method: 'GET'});
            const contentType = response.headers.get('content-type');
            response = await response.text();
            // CATCH DATA
            this.cachingSave(url, response);
    
            return {response, contentType}
        } catch(err) {
            Logger.error(err);
            return {response: {}, contentType: ''};
        }
    }

    private cachingSave = async (url: string, response: any): Promise<void> => {
        try {
            Logger.info('SAVING RESPONSES TO CACHE');
            const existing = this.cached.filter(el => el.url == url);
            if(existing.length == 0) {
                this.cached.push({url, response});
            }
        } catch(err) {
            Logger.error(err);
        }
    }

    private cachingGet = (url: string): ICached | null => {
        try {
            Logger.info('GETTING RESPONSE FROM CACHED')
            const existing: ICached | null = this.cached.filter(el => el.url == url)[0];
            if(existing) return existing;
            return null;
        } catch(err) {
            Logger.error(err);
            return null;
        }
    }

    private POST = async (url: string, headers: Record<string, any>, body?: any): Promise<any> => {
        try {
            console.log('DOING POST')
            const response = await fetch(url, {
                method: 'POST',
                body,
                headers: headers
            });
            return response;
        } catch(err) {
            Logger.error(err);
            return {response: {}, contentType: {}};
        }
    }

    private PUT = async (url: string, headers: Record<string, any>, body: any): Promise<any> => {
        try {
            console.log('DOING PUT');
            const response = await fetch(url, {
                method: 'PUT',
                body,
                headers: headers
            });
            return response;
        } catch(err) {
            Logger.error(err);
            return {response: {}, contentType: {}};
        }
    }

    private DELETE = async (url: string, headers: Record<string, any>, body: any): Promise<any> => {
        try {
            console.log('DOING DELETE');
            const response = await fetch(url, {
                method: 'DELETE',
                body,
                headers: headers
            });
            return response;
        } catch(err) {
            Logger.error(err);
            return {response: {}, contentType: {}};
        }
    }

}


export default new ProxyClass();
