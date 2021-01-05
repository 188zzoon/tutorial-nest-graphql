import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { JwtService } from "src/jwt/jwt.service";
import { MailService } from "src/mail/mail.service";
import { User } from "./entities/user.entity";
import { Verification } from "./entities/verification.entity";
import { UserService } from "./users.service";
import { Repository } from "typeorm";
import { UsersResolver } from "./users.resolver";
import { serialize } from "class-transformer";
import { string } from "joi";
import { response } from "express";
import { Restaurant } from "src/restaurants/entities/restaurant.entity";

type mockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>

const mockRepository = () => ({
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn()
});

const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
}

const mockMailService = {
    sendVerificationEmail: jest.fn()
}

describe("UserService", () => {
    let service: UserService
    let userRepository: mockRepository<User>
    let verificationRepository: mockRepository<Verification>
    let mailService: MailService
    

    beforeAll(async () => {
        const module = await Test.createTestingModule({
            providers: [
            UserService,
            {
                provide: getRepositoryToken(User),
                useValue: mockRepository()
            },
            {
                provide: getRepositoryToken(Verification),
                useValue: mockRepository()
            },
            {
                provide: JwtService,
                useValue: mockJwtService
            },
            {
                provide: MailService,
                useValue: mockMailService
            }

        ],
        }).compile()
        service =  module.get<UserService>(UserService)
        mailService = module.get<MailService>(MailService)
        userRepository = module.get(getRepositoryToken(User));
        verificationRepository = module.get(getRepositoryToken(Verification))
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    })

    describe('createAccount', () => {
        const createAccountArgs = {
            email: 'bs@email.com',
            password: 'bs@email.com',
            role: 0,
        };

        it('should fail if user exists', async () => {
            userRepository.findOne.mockResolvedValue({
                id: 1,
                email: ''
            })
            const result = await service.createAccount(createAccountArgs);
            expect(result).toMatchObject({
                ok: false,
                error: 'There is a user with that email already'
            });
        });
        it('should create a new user', async () => {
            userRepository.findOne.mockResolvedValue(undefined);
            userRepository.create.mockReturnValue(createAccountArgs);
            userRepository.save.mockResolvedValue(createAccountArgs);
            verificationRepository.create.mockResolvedValue({
                user: createAccountArgs
            });
            verificationRepository.save.mockResolvedValue({
                code: 'code'
            })

            const result = await service.createAccount(createAccountArgs)

            expect(userRepository.create).toHaveBeenCalledTimes(1)
            expect(userRepository.create).toHaveBeenCalledWith(createAccountArgs)

            expect(userRepository.save).toHaveBeenCalledTimes(1)
            expect(userRepository.save).toHaveBeenCalledWith(createAccountArgs)

            expect(verificationRepository.create).toHaveBeenCalledTimes(1)
            expect(verificationRepository.create).toHaveBeenCalledWith({
                user: createAccountArgs
            });

            expect(verificationRepository.save).toHaveBeenCalledTimes(1)
            expect(verificationRepository.save).toHaveBeenCalledWith({
                user: createAccountArgs
            });

            expect(mailService.sendVerificationEmail).toHaveBeenCalledTimes(1)
            expect(mailService.sendVerificationEmail).toHaveBeenCalledWith(
                expect.any(string),
                expect.any(string)
            );
            expect(result).toEqual({ok: true})
        });
    });

    it.todo("login")
    it.todo("editProfile")
    it.todo("verfityEmail")
})