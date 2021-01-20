import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { Role } from 'src/auth/role.decorator';
import { User } from 'src/users/entities/user.entity';
import { CreatePaymentInput, CreatePaymentOuput } from './dtos/create-pyment.dto';
import { GetPaymentsOutput } from "./dtos/get-payments.dto";
import { Payment } from './entities/payment.entity';
import { PaymentsService } from "./payments.service";

@Resolver(of => Payment)
export class PaymentsResolver {
    constructor(private readonly paymentService: PaymentsService) {}

    @Mutation(returns => CreatePaymentOuput)
    @Role(['Owner'])
    createPayment(
        @AuthUser() owner: User,
        @Args('input') createPaymentInput: CreatePaymentInput,
    ) : Promise<CreatePaymentOuput> {
        return this.paymentService.createPayment(owner, createPaymentInput)
    }

    @Query(returns => GetPaymentsOutput)
    @Role(['Owner'])
    getPayments(@AuthUser() user: User) : Promise<GetPaymentsOutput>{
        return this.paymentService.getPayments(user);

    }
}
