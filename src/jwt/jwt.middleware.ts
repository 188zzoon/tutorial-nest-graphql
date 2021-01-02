import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

// export function  jwtMiddleware(req: Request, res: Response, next: NextFunction) {
//     console.log(req.headers)
//     next()
// }
 
@Injectable()
export class JwtMiddleware implements NestMiddleware {
    constructor() {}

    async use(req: Request, res: Response, next: NextFunction)
    {
        console.log("Test: Class MiddleWare")
        console.log(req.headers['x-jwt'])
        
        next()
    }

}