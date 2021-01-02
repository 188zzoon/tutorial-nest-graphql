import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { LoginOutput, LoginInput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOuptut } from "./dtos/user-profile.dto";
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
    try {
      const {ok, error} = await this.usersService.createAccount(
        createAccountInput
      )
      return {
        ok,
        error,
      }
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }

  @Mutation(returns => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const {ok, error, token} = await this.usersService.login(loginInput)
      return {ok, error, token}
    } catch (error) {
        ok: false
        error
    }
  }

  @Query(returns => User)
  @UseGuards(AuthGuard)
  me(@AuthUser() authUser : User ){
    console.log(authUser)
    return authUser
  }
  // me(@Context() context) {
  //   console.log(context)
  //   if (!context.user) {
  //     console.log("rere")
  //   } else{
  //     return context.user
  //   }
  // }

  // @UseGuards(AuthUser)
  @UseGuards(AuthGuard)
  @Query(returns => UserProfileOuptut)
  async userProfile(
    @Args() userProfileInput: UserProfileInput
  ) : Promise<UserProfileOuptut> {
    try{
      const user = await this.usersService.findById(userProfileInput.userId)
      if (!user) {
        throw Error();
      }
      return {
        ok: true,
        user,
      }

    }catch(e) {
      return {
        error: 'User Not Found',
        ok: false
      }
    }
  }
}