import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { CreateDishInput, CreateDishOutput } from 'src/restaurants/dtos/create-dish.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput } from './dtos/create-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from "./orders.service";

@Resolver(of => Order)
export class OrdersResolver {
    constructor(private readonly ordersService: OrdersService) {}

    async createOrder(
        @AuthUser() customer: User,
        @Args('input')
        createOrderInput: CreateOrderInput,
    ) : Promise<CreateDishOutput> {
        return this.ordersService.createOrder(customer, createOrderInput)
    }

}
