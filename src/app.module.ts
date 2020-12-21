import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import { ResturantsModule } from './resturants/resturants.module';

@Module({
  imports: [
    ResturantsModule,
    GraphQLModule.forRoot({
      autoSchemaFile: true
    }), 
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
