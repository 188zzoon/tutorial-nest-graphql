import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { Console } from 'console';
import { any } from 'joi';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOuptut } from "./dtos/user-profile.dto";
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { UserService } from './users.service';

@Resolver(of => User)
export class UsersResolver {
  constructor(private readonly usersService: UserService) {}

  @Query(returns => Boolean)
  hi() {
    return true;
  }

  @Mutation(returns => CreateAccountOutput)
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput)
  }

  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput)
  }

  @Query(returns => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser: User): User {
    return authUser;
  }


  @UseGuards(AuthGuard)
  @Query(returns => UserProfileOuptut)
  async userProfile(
    @Args() userProfileInput: UserProfileInput
  ) : Promise<UserProfileOuptut> {
      return this.usersService.findById(userProfileInput.userId)
  }

  @Mutation(returns => EditProfileOutput)
  @UseGuards(AuthGuard)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput
  ) : Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput)
  }

  @Mutation(returns => VerifyEmailOutput)
  async verifyEmail(@Args('input') {code} : VerifyEmailInput) : Promise<VerifyEmailOutput> {
    return this.usersService.verifyEmail(code)
  }
}