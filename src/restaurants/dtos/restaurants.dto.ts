import { InputType, ObjectType, Field } from "@nestjs/graphql";
import { PaginationInput, PagenationOutput } from "src/common/dtos/pagination.dto";
import { Restaurant } from "../entities/restaurant.entity";


@InputType()
export class RestaurantInput extends PaginationInput {
}


@ObjectType()
export class RestaurantOutput extends PagenationOutput{
    @Field(type => [Restaurant], {nullable:true})
    results?: Restaurant[]
}