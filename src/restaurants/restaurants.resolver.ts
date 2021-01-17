import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { promises } from 'fs';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from "src/auth/role.decorator";
import { User, UserRole} from 'src/users/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto.ts";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantsService } from "./restaurants.service";
import { Category } from './entities/category.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';


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
        @AuthUser() owner: User,
        @Args('input') editRestaurantInput: EditRestaurantInput,
    ): Promise<EditRestaurantOutput> {
        return this.restaurantsService.editRestaurant(owner, editRestaurantInput)
    }

    @Mutation(returns => DeleteRestaurantOutput)
    @Role(['Owner'])
    deleteRestaurant(
        @AuthUser() owner: User,
        @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
    ) : Promise<DeleteRestaurantOutput> {
        return this.restaurantsService.deleteRestaurant(owner, deleteRestaurantInput)

    }
}

@Resolver(of => Category)
export class CategoryResolver {
    constructor(private readonly restaurantService: RestaurantsService) {}
                                
    
    @ResolveField(type => Int)
    restaurantCount(@Parent() category: Category): Promise<number> {
        return this.restaurantService.countRestaurants(category)
    }

    @Query(type => AllCategoriesOutput)
    allCategories(): Promise<AllCategoriesOutput> {
        return this.restaurantService.allCategories();
    }

    countRestaurants(category: Category) {
        return this.restaurantService.countRestaurants(category);
      }
}