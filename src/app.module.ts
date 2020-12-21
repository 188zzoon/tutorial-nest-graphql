import { Module } from '@nestjs/common';
import { GraphQLModule } from "@nestjs/graphql";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RestaurantsModule } from './restaurants/restaurants.module';

@Module({
  imports: [
    RestaurantsModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: '165.246.43.140',
      port: 5432,
      username: 'postgres',
      password: 'dev4481',
      database: 'nuber-eats',
      entities: [],
      synchronize: true,
			logging: true
    }),

    GraphQLModule.forRoot({
      autoSchemaFile: true
    }), 
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
