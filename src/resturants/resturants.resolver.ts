import { Query, Resolver } from '@nestjs/graphql';
import { Restaurant } from "./entities/restaurant.entity";

@Resolver()
export class ResturantsResolver {
    
    @Query(returns => Restaurant)
    myRestaurant() {
        return true
    }
}
