import { Field, InputType, Int, PickType } from "@nestjs/graphql";
import { CoreOutput } from "src/common/dtos/output.dto";
import { Order } from "src/orders/entities/order.entity";

@InputType()
export class CreateOrderInput extends PickType(Order, ['items']) {

    @Field(type => Int)
    restaurantId: number
}

@Object()
export class  CreateOrderOutput extends CoreOutput{}