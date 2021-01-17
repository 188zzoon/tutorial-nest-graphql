import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { PaginationInput, PagenationOutput } from "src/common/dtos/pagination.dto";
import { Restaurant } from "../entities/restaurant.entity";

@InputType()
export class SearchRestaurantInput extends PaginationInput {
    @Field(type => String)
    query: string
}

@ObjectType()
export class SearchRestaurantOutput extends PagenationOutput {
    @Field(type => [Restaurant], {nullable:true})
    restaurants?: Restaurant[]
}