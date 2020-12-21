import { Field, ObjectType } from "@nestjs/graphql";

<<<<<<< HEAD
// @ObjectType() 없으면 Error 발생
=======
>>>>>>> 6c06e866f4f0e4398c70fbad2fab6156c25531db
@ObjectType()
export class Restaurant {
    @Field(type => String)
    name: String;

    @Field(type => Boolean, {nullable: true})
    isGood? : Boolean

}
