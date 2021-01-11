import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from "typeorm";
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from "./entities/user.entity";
import { JwtService } from 'src/jwt/jwt.service';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { Verification } from "./entities/verification.entity";
import { UserProfileOuptut } from './dtos/user-profile.dto';
import { VerifyEmailOutput } from './dtos/verify-email.dto';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private readonly users: Repository<User>,
        @InjectRepository(Verification) private readonly verifications: Repository<Verification>,
        private readonly jwtService: JwtService,
        private readonly mailService: MailService
        ){}
    
    async createAccount({email, password, role}: CreateAccountInput) : Promise<{ok: boolean, error?: string}> {
        try {
            const exists = await this.users.findOne({email})
            if(exists) {
                return {
                    ok: false,
                    error : 'There is a user with that email already'
                }
            }
            const user =  await this.users.save(this.users.create({email,password,role}));
            const verification = await this.verifications.save(this.verifications.create({user}))
            this.mailService.sendVerificationEmail(user.email, verification.code)
            
            return {ok: true}
        } catch (e) {
            return {
                ok: false,
                error: "Couldn't create account"
            }
        }
    }
    async login({
        email,
        password,
      }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
        try {
            const user = await this.users.findOne(
                {email},
                {select: ['id', 'password']}
                )
            if(!user) {
                return {
                    ok: false,
                    error: 'User not found'
                }
            }
            const passwordCheck = await user.checkPassword(password)
            if(!passwordCheck) {
                return {
                    ok: false,
                    error: 'Wrong password'
                }
            }
            const token = this.jwtService.sign(user.id)
            return {
                ok: true,
                token
            }
        } catch (error) {
            return {
                ok: false,
                error
            }
        }
      }
    
    async findById(id: number): Promise<UserProfileOuptut> {
        try{
            const user = await this.users.findOne({id});
            if(user) {
                return {
                    ok: true,
                    user: user
                }
            }
        }catch(e) {
            return {
                ok: false,
                error: 'User not Found'
            }
        }
    }
    async editProfile(
        userId: number, { email, password}: EditProfileInput
    ) : Promise<EditProfileOutput> {

        try {
            const user = await this.users.findOne(userId)
            if (email) {
                user.email = email
                user.verified = false
                const verification = await this.verifications.save(this.verifications.create({user}))
                this.mailService.sendVerificationEmail(user.email, verification.code)
                

            }
            if (password) {
                user.password = password
            }
            await this.users.save(user);
            return {
                ok: true
            };
        } catch (error) {
            return {ok: false, error: 'Could not update profile'}
        }
    }

    async verifyEmail(code: string): Promise<VerifyEmailOutput> {
        try {
            const verification = await this.verifications.findOne(
                {code}, 
                {relations: ['user']}
            )
            if (verification) {
                verification.user.verified = true
                await this.users.save(verification.user)
                await this.verifications.delete(verification.id)
                
                return {ok: true};
            }
            return {
                ok: false,
                error: "Verification not found"
            }
        } catch (error) {
            return {ok: false, error: "Colud not verify email"}           
        }
    }
}