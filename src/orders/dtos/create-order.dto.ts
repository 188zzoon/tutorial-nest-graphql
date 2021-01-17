import { Field, InputType, Int, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Order } from "src/orders/entities/order.entity";
import { DishOption } from "src/restaurants/entities/dish.entity";

@InputType()
class CreateOrderItemInput {

    @Field(type => Int)
    dishId: number

    @Field(type => DishOption, {nullable: true})
    options?: DishOption[]
}

@InputType()
export class CreateOrderInput {
    @Field(type => Int)
    restaurantId: number

    @Field(type=> [CreateOrderItemInput])
    items: CreateOrderInput[]
}

@Object()
export class  CreateOrderOutput extends CoreOutput{}