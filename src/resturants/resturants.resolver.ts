import { Query, Resolver } from '@nestjs/graphql';

@Resolver()
export class ResturantsResolver {
    
    @Query(returns => Boolean)
    isPizzaGood(): Boolean {
        return true
    }
}
