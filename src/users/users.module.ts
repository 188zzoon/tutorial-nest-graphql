import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UsersResolver } from './users.resolver';
import { UserService } from './users.service';

@Module({
  imports: [TypeOrmModule.forFeature([User]), ConfigService],
  providers: [UsersResolver, UserService]
})
export class UserModule {}
