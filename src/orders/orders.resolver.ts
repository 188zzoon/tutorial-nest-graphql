import { Inject } from "@nestjs/common";
import { Args, Mutation, Resolver, Query, Subscription } from '@nestjs/graphql';
import { PubSub } from 'graphql-subscriptions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { CreateDishOutput } from 'src/restaurants/dtos/create-dish.dto';
import { User } from 'src/users/entities/user.entity';
import { CreateOrderInput } from './dtos/create-order.dto';
import { EditOrderInput, EditOrderOutput } from './dtos/edit-order.dto';
import { GetOrderInput, GetOrderOutput } from './dtos/get-order.dto';
import { GetOrdersInput, GetOrdersOutput } from './dtos/get-orders.dto';
import { Order } from './entities/order.entity';
import { OrderService } from "./orders.service";
import { 
    NEW_COOKED_ORDER,
    NEW_PENDING_ORDER,
    PUB_SUB,
 } from "src/common/common.constants";


@Resolver(of => Order)
export class OrdersResolver {
    constructor(
        private readonly orderService: OrderService
        @Inject(PUB_SUB) private readonly pubsub: PubSub
        ) {}

    async createOrder(
        @AuthUser() customer: User,
        @Args('input')
        createOrderInput: CreateOrderInput,
    ) : Promise<CreateDishOutput> {
        return this.orderService.crateOrder(customer, createOrderInput)
    }

    @Query(returns => GetOrdersOutput)
    @Role(['Any'])
    async getOrders(
        @AuthUser() user: User,
        @Args('input') getOrdersInput: GetOrdersInput,
    ) : Promise<GetOrdersOutput> {
        return this.orderService.getOrders(user, getOrdersInput)
    }

    @Query(returns => GetOrderOutput)
    @Role(['Any'])
    async getOrder(
        @AuthUser() user: User,
        @Args('input') getOrderInput: GetOrderInput,
    ) : Promise<GetOrderOutput> {
        return this.orderService.getOrder(user, getOrderInput)
    }

    @Mutation(returns => EditOrderOutput)
    @Role(['Any'])
    async editOrder(
        @AuthUser() user: User,
        @Args('input') editOrderInput: EditOrderInput,
    ) : Promise<EditOrderOutput>{
        return this.orderService.editOrder(user, editOrderInput)
    }

    @Subscription(returns => Order, {
        filter: ({ pendingOrders: { ownerId } }, _, { user }) => {
          return ownerId === user.id;
        },
        resolve: ({ pendingOrders: { order } }) => order,
    })
    @Role(['Owner'])
    pendingOrders() {
        return this.pubsub.asyncIterator(NEW_PENDING_ORDER)
    }

    @Subscription(returns => Order)
    @Role(['Delivery'])
    cookedOrders() {
        return this.pubsub.asyncIterator(NEW_COOKED_ORDER)
    }
}
