import { Module } from '@nestjs/common';
import { ResturantsResolver } from './resturants.resolver';

@Module({
  providers: [ResturantsResolver]
})
export class ResturantsModule {}
