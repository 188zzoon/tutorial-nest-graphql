import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from "src/auth/role.decorator";
import { User, UserRole} from 'src/users/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto.ts";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantsService } from "./restaurants.service";

@Resolver(of => Restaurant)
export class RestaurantsResolver {
    constructor(private readonly restaurantsService: RestaurantsService) {}

    @Mutation(returns => CreateRestaurantOutput)
    @Role(['Owner'])
    async createRestaurant(
        @AuthUser() authUser: User,
        @Args('input') createRestaurantInput: CreateRestaurantInput
    ) : Promise<CreateRestaurantOutput> {
        return this.restaurantsService.createRestaurant(
            authUser,
            createRestaurantInput
        )
    }

    
    @Mutation(returns => EditRestaurantOutput)
    @Role(['Owner'])
    editRestaurant(
        @AuthUser() authUser: User,
        @Args('input') editRestaurantInput: EditRestaurantInput,
    ): EditRestaurantOutput {
        return { ok: true}
    }

}
