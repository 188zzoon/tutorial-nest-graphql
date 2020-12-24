import { Field, ObjectType, InputType, } from "@nestjs/graphql";
import { IsBoolean, IsString,Length } from "class-validator";
import { Column, Entity ,PrimaryGeneratedColumn } from "typeorm";

@InputType({isAbstract: true})
@ObjectType()
@Entity()
export class Restaurant {

    @PrimaryGeneratedColumn()
    @Field(type => Number)
    @IsString()
    @Length(5)
    id: number;

    @Field(type => String)
    @Column()
    @IsBoolean()
    @Length(5)
    name: string;

    @Field(type => String)
    @IsBoolean()
    @Length(5)
    isVegan: boolean;

    @Field(type => String)
    @Column()
    @IsString()
    address: string;

    @Field(type => String)
    @Column()
    @IsBoolean()
    @Length(5)
    ownerName: string;

    @Field(type => String)
    @Column()
    @IsString()
    categoryName: string
}