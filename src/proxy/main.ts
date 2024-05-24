import { readJson } from "../utils/jsonModifier";
import Logger from "../utils/logger";
import { Request, Response } from 'express';


interface ResponseProxyMethod {
    response: Record<string, any>,
    contentType: string
}

class ProxyClass {
    proxyConfiguration: Iservice[] | null = null;

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
            let response: any = await fetch(url, { method: 'GET'});
            const contentType = response.headers.get('content-type');
            response = await response.text();
            
            return {response, contentType}
        } catch(err) {
            Logger.error(err);
            return {response: {}, contentType: ''};
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
