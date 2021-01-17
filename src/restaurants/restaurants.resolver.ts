import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { promises } from 'fs';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from "src/auth/role.decorator";
import { User} from 'src/users/entities/user.entity';
import { CreateRestaurantInput, CreateRestaurantOutput } from "./dtos/create-restaurant.dto";
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto.ts";
import { DeleteRestaurantInput, DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";
import { DeleteDishInput, DeleteDishOutput } from "./dtos/delete-dish.dto";
import { EditDishInput, EditDishOutput } from "./dtos/edit-dish.dto";
import { Restaurant } from "./entities/restaurant.entity";
import { RestaurantsService } from "./restaurants.service";
import { Category } from './entities/category.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { SearchRestaurantInput, SearchRestaurantOutput } from './dtos/search-restaurant.dto';
import { Dish } from './entities/dish.entity';
import { CreateDishInput, CreateDishOutput } from './dtos/create-dish.dto';


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

    @Query(type => CategoryOutput)
    category(@Args("input") categoryInput: CategoryInput) : Promise<CategoryOutput> {
        return this.restaurantService.findCategoryBySlug(categoryInput)
    }

    @Query(returns => RestaurantOutput)
    restaurant (
        @Args('input') RestaurantInput: RestaurantInput
    ): Promise<RestaurantOutput> {
        return this.restaurantService.findRestaurantById(RestaurantInput)
    }

    @Query(returns => SearchRestaurantOutput)
    searchRestaurant(
        @Args('input') SearchRestaurantInput: SearchRestaurantInput
    ) : Promise<SearchRestaurantOutput> {
        return this.restaurantService.searchRestaurantByName(SearchRestaurantInput)
    }
}

@Resolver(of => Dish)
export class DishResolver {
  constructor(private readonly restaurantService: RestaurantsService) {}

  @Mutation(type => CreateDishOutput)
  @Role(['Owner'])
  createDish(
    @AuthUser() owner: User,
    @Args('input') createDishInput: CreateDishInput,
  ) : Promise<CreateDishOutput> {
    return this.restaurantService.createDish(owner, createDishInput);
  }

  @Mutation(type => EditDishOutput)
  @Role(["Owner"])
  editDish(
      @AuthUser() owner : User,
      @Args('input') editDishInput: EditDishInput,
  ) : Promise<EditDishOutput> {
      return this.restaurantService.editDish(owner, editDishInput)
  }

  @Mutation(type => DeleteDishOutput)
  @Role(['Owner'])
  deleteDish(
      @AuthUser() owner: User,
      @Args('input') deleteDishInput: DeleteDishInput,
  ) : Promise<DeleteDishOutput> {
      return this.restaurantService.deleteDish(owner, deleteDishInput)
  }
}