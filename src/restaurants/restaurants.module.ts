import { Module } from '@nestjs/common';
import { RestaurantsService } from './restaurants.service';
import { CategoryResolver, DishResolver, RestaurantsResolver } from './restaurants.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Dish } from './entities/dish.entity';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/category.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant, Dish ,CategoryRepository])],
  providers: [RestaurantsService, RestaurantsResolver, CategoryResolver, DishResolver]
})
export class RestaurantsModule {}
