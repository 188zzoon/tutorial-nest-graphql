import { ArgsType, Field, InputType, ObjectType } from "@nestjs/graphql";
import { Category } from "../entities/category.entity";
import { PaginationInput, PagenationOutput  } from "src/common/dtos/pagination.dto";


@InputType()
export class CategoryInput extends PaginationInput {
    @Field(type => String)
    slug: string;
}

@ObjectType()
export class CategoryOutput extends PagenationOutput {
    @Field(type => Category, {nullable: true})
    category?: Category
}