import { InputType, ObjectType, PickType } from "@nestjs/graphql";
import { Verification } from "../entities/verification.entity";
import { CoreOutput } from "src/common/dtos/output.dto";

@ObjectType()
export class VerifyEmailOutput extends CoreOutput {}

@InputType()
export class VerifyEmailInput extends PickType(Verification, ['code']) {}