import { Request } from 'express'

declare global {   
    interface Iservice {
        subdomain: string,
        route: string
    }
    
    interface ICustomRequest<T> extends Request {
        body: T
    } 

    interface IAddRouteConfigRequest extends Request {
        body: Iservice
    }
}