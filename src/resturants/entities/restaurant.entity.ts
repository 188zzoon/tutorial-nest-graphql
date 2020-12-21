import { Field, ObjectType } from "@nestjs/graphql";

// @ObjectType() 없으면 Error 발생
@ObjectType()
export class Restaurant {
    @Field(type => String)
    name: String;

    @Field(type => Boolean, {nullable: true})
    isGood? : Boolean

}
