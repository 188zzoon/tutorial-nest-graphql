
import { Field, InputType, ObjectType, PickType } from "@nestjs/graphql";
import { User } from "src/users/entities/user.entity";
import { CoreOutput } from "src/common/dtos/output.dto";

@InputType()
export class CreateAccountInput extends PickType(User, [
    'email',
    'password',
    'role'
]) {}


// @ObjectType()
// export class CreateAccountOutput{

//     @Field(type => String, {nullable: true})
//     error?: string

//     @Field(type => Boolean)
//     ok:boolean
// }

@ObjectType()
export class CreateAccountOutput extends CoreOutput {}