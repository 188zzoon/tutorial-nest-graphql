import { Query } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CreateDishInput, CreateDishOutput } from 'src/restaurants/dtos/create-dish.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput } from './dtos/create-order.dto';
import { GetOrderOutput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from "./orders.service";

@Resolver(of => Order)
export class OrdersResolver {
    constructor(private readonly orderService: OrderService) {}

    async createOrder(
        @AuthUser() customer: User,
        @Args('input')
        createOrderInput: CreateOrderInput,
    ) : Promise<CreateDishOutput> {
        return this.orderService.crateOrder(customer, createOrderInput)
    }


    @Query(returns => GetOrderOutput)
    @Role(['Any']
    async getOrders(
        @AuthUser() user: User,
        @Args('input') getOrderInput: GetOrdersInput,
    ) : Promise<GetOrdersOutput> {
        
    }
}
