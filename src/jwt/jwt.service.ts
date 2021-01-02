import { Inject, Injectable } from '@nestjs/common';
import * as jwt from "jsonwebtoken";
import { CONFIG_OPTIONS } from './jwt.constants';
import { JwtModuleOptions } from './jwt.interfaces';

@Injectable()
export class JwtService {
    constructor(
        @Inject(CONFIG_OPTIONS) private readonly options: JwtModuleOptions,
    ){}
    hello() {
        console.log('hello')
    }

    sign(userId: number): string {
        return jwt.sign({id:userId}, this.options.privateKey)
    }

    verity(token: string) {
        return jwt.verify(token, this.options.privateKey)
    }
}
