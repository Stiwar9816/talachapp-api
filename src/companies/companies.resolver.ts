import { Inject, ParseUUIDPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Subscription } from '@nestjs/graphql';
// Service
import { CompaniesService } from './companies.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { UserRoles } from 'src/auth/enums/user-role.enum';
import { JwtAuthGuard, NoAuthAuthGuard } from 'src/auth/guards';
// Entity/Dto's(Inputs)
import { CreateCompanyInput, UpdateCompanyInput } from './dto';
import { Company } from './entities/company.entity';
import { User } from 'src/users/entities/user.entity';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(
    @Inject('PUB_SUB') private readonly pubSub: PubSub,
    private readonly companiesService: CompaniesService,
  ) {}

  @Mutation(() => Company, {
    name: 'createCompany',
    description: 'Create a new companies/talacheros',
  })
  @UseGuards(JwtAuthGuard)
  async createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.superAdmin,
      UserRoles.Talachero,
    ])
    currentUser: User,
    @Args('idTalachero', { type: () => String }, ParseUUIDPipe)
    idTalachero: string,
  ) {
    const createCompany = await this.companiesService.create(
      createCompanyInput,
      idTalachero,
    );
    this.pubSub.publish('newCompany', { newCompany: createCompany });
    return createCompany;
  }

  @Query(() => [Company], {
    name: 'companies',
    description: 'Returns all of the registered companies or talacheros',
  })
  @UseGuards(JwtAuthGuard)
  findAll(
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.superAdmin,
      UserRoles.Talachero,
    ])
    user: User,
  ) {
    return this.companiesService.findAll(user);
  }

  @Query(() => Company, {
    name: 'company',
    description: 'Returns a single specific record queried by ID',
  })
  @UseGuards(JwtAuthGuard)
  findOne(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.superAdmin,
      UserRoles.Talachero,
    ])
    user: User,
  ) {
    return this.companiesService.findOne(id);
  }

  @Mutation(() => Company, {
    name: 'updateCompany',
    description: 'Update the data of a specific company',
  })
  @UseGuards(JwtAuthGuard)
  updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
    @Args('idTalachero', { type: () => String, nullable: true })
    idTalachero?: string,
  ) {
    return this.companiesService.update(
      updateCompanyInput.id,
      updateCompanyInput,
      user,
      idTalachero,
    );
  }

  @Mutation(() => Company, {
    name: 'blockCompany',
    description:
      'Inactivates a company by passing the company ID as a parameter',
  })
  @UseGuards(JwtAuthGuard)
  blockCompany(
    @Args('id', { type: () => String }, ParseUUIDPipe) id: string,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User,
  ) {
    return this.companiesService.block(id, user);
  }

  @Query(() => Number, {
    name: 'workerCountByCompany',
    description: 'Returns the count of workers related to a specific company',
  })
  @UseGuards(JwtAuthGuard)
  getWorkerCountByCompanyId(
    @Args('companyId', { type: () => String }, ParseUUIDPipe)
    companyId: string,
    @CurrentUser([
      UserRoles.Administrador,
      UserRoles.superAdmin,
      UserRoles.Talachero,
    ])
    user: User,
  ): Promise<number> {
    return this.companiesService.getWorkerCountByCompany(companyId);
  }

  @Subscription(() => Company, {
    name: 'newCompany',
    description: 'Subscribe to new companies',
  })
  @UseGuards(NoAuthAuthGuard)
  subscribeNewCompany(): AsyncIterator<Company> {
    return this.pubSub.asyncIterator('newCompany');
  }
}
