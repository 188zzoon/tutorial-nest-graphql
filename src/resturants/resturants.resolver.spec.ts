import { Test, TestingModule } from '@nestjs/testing';
import { ResturantsResolver } from './resturants.resolver';

describe('ResturantsResolver', () => {
  let resolver: ResturantsResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ResturantsResolver],
    }).compile();

    resolver = module.get<ResturantsResolver>(ResturantsResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
