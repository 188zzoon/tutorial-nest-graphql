import { Injectable } from '@nestjs/common';
import { Repository } from "typeorm";
import { User } from "src/users/entities/user.entity";
import {
    CreateRestaurantInput,
    CreateRestaurantOutput
} from './dtos/create-restaurant.dto'

import { Restaurant } from "src/restaurants/entities/restaurant.entity";
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from './entities/category.entity';

@Injectable()
export class RestaurantsService {

    constructor(
        @InjectRepository(Restaurant)
        private readonly restaurants: Repository<Restaurant>,
        @InjectRepository(Category)
        private readonly categories: Repository<Category>
    ) {}

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

  
            const categoryName = createRestaurantInput.categoryName.trim().toLowerCase()
            const categorySlug = categoryName.replace(/ /g, '-');

            let category = await this.categories.findOne({slug: categorySlug})
            if(!category){
                category = await this.categories.save(
                    this.categories.create({slug: categorySlug, name:categoryName})
                )
            }
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
}
