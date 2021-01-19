import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { CoreOutput} from "src/common/dtos/output.dto";
import { Order, OrderStatus } from "../entities/order.entity";

@InputType()
export class GetOrderInput {
    @Field(type => OrderStatus, {nullable: true})
    status?: OrderStatus
}

@ObjectType()
export class GetOrderOutput extends CoreOutput {
    @Field(type => [Order], {nullable: true})
    orders?: Order[]
}
