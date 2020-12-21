import { Field, ObjectType } from "@nestjs/graphql";

@ObjectType()
export class Restaurant {
    @Field(type => String)
    name: string;

    @Field(type => String)
    isVegan: boolean;

    @Field(type => String)
    address: string;

    @Field(type => String)
    ownerName: string;
}
