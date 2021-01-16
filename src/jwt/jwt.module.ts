import { DynamicModule, Module,Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { UserService } from 'src/users/users.service';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from "src/common/common.constants";
import { JwtService } from './jwt.service';
import { JwtMiddleware } from './jwt.middleware';

@Module({})
@Global()
export class JwtModule {
    static forRoot(
        options: JwtModuleOptions): DynamicModule {
        return {
            module :JwtModule,
            
            providers: [
                {
                    provide: CONFIG_OPTIONS,
                    useValue: options
                },
                JwtService
            ],
            exports: [JwtService],
        }
    }
}
