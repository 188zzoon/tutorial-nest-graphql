import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';
import { OrdersResolver } from './orders.resolver';

@Module({
    imports: [TypeOrmModule.forFeature([Order])],
    providers: [OrdersService, OrdersResolver]
})
export class OrdersModule {}
