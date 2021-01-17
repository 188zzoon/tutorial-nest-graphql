  
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import {
  PaginationInput,
  PagenationOutput,
} from 'src/common/dtos/pagination.dto';
import { Restaurant } from '../entities/restaurant.entity';

@InputType()
export class RestaurantsInput extends PaginationInput {}

@ObjectType()
export class RestaurantsOutput extends PagenationOutput {
  @Field(type => [Restaurant], { nullable: true })
  results?: Restaurant[];
}