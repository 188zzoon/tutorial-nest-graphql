import { Injectable } from '@nestjs/common';
import { Like, Raw, Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { CreateRestaurantInput,CreateRestaurantOutput} from './dtos/create-restaurant.dto'
import { EditRestaurantInput, EditRestaurantOutput } from "./dtos/edit-restaurant.dto.ts";
import { DeleteRestaurantInput,DeleteRestaurantOutput } from "./dtos/delete-restaurant.dto";

import { InjectRepository } from '@nestjs/typeorm';
import { RestaurantsInput, RestaurantsOutput } from "./dtos/restaurants.dto";
import { RestaurantInput, RestaurantOutput } from "./dtos/restaurant.dto";
import { SearchRestaurantInput, SearchRestaurantOutput } from "./dtos/search-restaurant.dto";
import { Category } from './entities/category.entity';
import { CategoryRepository } from './repositories/category.repository';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';


@Injectable()
export class RestaurantsService {

    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category)
        private readonly categories: CategoryRepository
    ) {}

    async getOrCreate(name: string) : Promise<Category> {
        const categoryName = name.trim().toLowerCase();
        const categorySlug = categoryName.replace(/ /g, '-');
        let category = await this.categories.findOne({slug: categorySlug})
        if (!category) {
            category = await this.categories.save(
                this.categories.create({slug: categorySlug, name: categoryName})
            );
        }
        return category;
    }

    async createRestaurant(
        owner: User,
        createRestaurantInput: CreateRestaurantInput,
    ) : Promise<CreateRestaurantOutput> {
        try {
            
            // Problem Code - CAPITAL 'C'
            // const newRestaurant = await this.restaurants.create(CreateRestaurantInput)
            
            // Fix Code
            const newRestaurant = await this.restaurants.create(createRestaurantInput)
            newRestaurant.owner = owner;

            const category = await this.getOrCreate(
                createRestaurantInput.categoryName
            )

            // ORG CODE
            newRestaurant.category = category
            await this.restaurants.save(newRestaurant)
            return {
                ok: true
            }
        } catch{
            return {
                ok: false,
                error: "Could not create restaurant"
            }
        }
    }

    async editRestaurant(
        owner: User,
        editRestaurantInput: EditRestaurantInput,
      ): Promise<EditRestaurantOutput> {
          try {
              const restaurant = await this.restaurants.findOne(
                  editRestaurantInput.restaurantId
              )
              if(!restaurant) {
                return {
                    ok: false,
                    error: 'Restaurant not found'
                }
              }

              if(owner.id !== restaurant.owerId) {
                  return {
                      ok: false,
                      error: "You can't edit a restaurant that you don't own"
                  }
              }

              let category: Category = null
              if (editRestaurantInput.categoryName) {
                  category = await this.categories.getOrCreate(
                      editRestaurantInput.categoryName
                  )
              }
              
              await this.restaurants.save(
                  [
                    {
                        id: editRestaurantInput.restaurantId,
                        ...editRestaurantInput,
                        ...(category && {category})
                    }
                  ]
              )
              return {
                  ok: true
              };
          } catch{
            return {
                ok: false,
                error: 'Could not edit Restaurant',
            }
          }
      }

      
    async deleteRestaurant(
        owner: User,
        { restaurantId } : DeleteRestaurantInput 
    ): Promise<DeleteRestaurantOutput>{
        try {
            console.log(`ID : ${restaurantId}`)
            const restaurant = await this.restaurants.findOne(restaurantId);

            console.log(owner['user'])

            console.log(`${owner.id} / ${restaurant.owerId}`)
            if(!restaurant) {
                return {
                    ok: false,
                    error: "Restaurant not found"
                };
            }
            if(owner.id !== restaurant.owerId) {
                return {
                    ok: false,
                    error: "You can't delete a restaurant that you don't own"
                }
            };
        await this.restaurants.delete(restaurantId)
        return {
            ok: true
            
        }
        } catch{
            return{
            ok: false,
            error: 'Colud not delete restaurant.'
        }
        }
    }

    async allCategories(): Promise<AllCategoriesOutput> {
        try {
          const categories = await this.categories.find();
          return {
            ok: true,
            categories,
          };
        } catch {
          return {
            ok: false,
            error: 'Could not load categories',
          };
        }
      }
      
    countRestaurants(category: Category) {
        return this.restaurants.count({category})

    }
    async findCategoryBySlug({slug, page} : CategoryInput) : Promise<CategoryOutput> {
        try {
            const category = await this.categories.findOne({slug})
            console.log(category)
            if (!category) {
                return {
                    ok: false,
                    error: "Category not found"
                }
            }
            const restaurants = await this.restaurants.find({
                where : {
                    category
                },
                take: 25,
                skip:(page - 1) * 25
            });
            category.restaurants = restaurants
            const totalResults = await this.countRestaurants(category)
            return {
                ok:true,
                restaurants,
                category,
                totalPages: Math.ceil(totalResults/25)
            }
        } catch{
            return{
               ok: false,
               error: 'Could not load category'
            }
        }
    }

    
    async allRestaurants({page}: RestaurantsInput) : Promise<RestaurantsOutput> {
        try {
            const [restaurant, totalResults] = await this.restaurants.findAndCount({
                skip: (page-1) * 25,
                take: 25
        });
        return {
            ok: true,
            results: restaurant,
            totalPages: Math.ceil(totalResults/25),
            totalResults
        }
        } catch {
            return {
                ok: false,
                error: 'Could not load restaurants'
            }
            
        }        
    }

    async findRestaurantById(
        {restaurantId} : RestaurantInput) : Promise<RestaurantOutput> {
            try {
                const restaurant = await this.restaurants.findOne(restaurantId)
                if(!restaurant){
                    return {
                        ok: false,
                        error: `Restaurant not found`
                    };
                }
                return {
                    ok: true,
                    error: `Colud not find restaurant`
                };
            } catch{
                return {
                ok: false,
                error: 'Cloud not find restaurant'
            }
        }
    }

    async searchRestaurantByName({
        query, page
    }:SearchRestaurantInput) : Promise<SearchRestaurantOutput> {
        try {
            const [restaurants, totalResults] = await this.restaurants.findAndCount({
                where: {
                    // name: Like(`%${query}$`)\
                    name: Raw(name => `${name} ILIKE '%${query}'`),
                    skip: (page-1)*25,
                    take: 25
                }
            })
            return {
                ok: true,
                restaurants,
                totalResults,
                totalPages: Math.ceil(totalResults/25)
            }
        } catch{
            return {
                ok: false,
                error: 'Cloud not search for restaurants'
            };
        }
    }
}
