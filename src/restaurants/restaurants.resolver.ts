import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from "./dtos/create-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantsService } from "./restaurants.service";

@Resolver(of => Restaurant)
export class RestaurantResolver {

    constructor(private readonly restaurantService: RestaurantsService) {}


    @Query(returns => [Restaurant])
    restaurants(): Promise<Restaurant[]> {
        // console.log("test")
        // console.log(Restaurant)
        return this.restaurantService.getAll()
    }

    @Mutation(returns => Boolean)
    async createRestaurant(createRestaurantDto : CreateRestaurantDto): Promise <boolean> {
        try {
            await this.restaurantService.createRestaurant(createRestaurantDto)
            return true
        } catch (e) {
            console.log(e)
            return false
        }
    }
}