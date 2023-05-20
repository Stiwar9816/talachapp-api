import { ParseIntPipe, UseGuards } from '@nestjs/common';
// GraphQL
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
// Service
import { CompaniesService } from './companies.service';
// Auth (Enums/Decorators/Guards)
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { UserRoles } from 'src/auth/enums/user-role.enum';
// Entity/Dto's(Inputs)
import { CreateCompanyInput, UpdateCompanyInput } from './dto';
import { Company } from './entities/company.entity';
import { User } from 'src/users/entities/user.entity';

@Resolver(() => Company)
@UseGuards(JwtAuthGuard)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) { }

  @Mutation(() => Company, {
    name: 'createCompany',
    description: 'Create a new companies/talacheros'
  })
  createCompany(
    @Args('createCompanyInput') createCompanyInput: CreateCompanyInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin, UserRoles.Talachero]) user: User
  ) {
    return this.companiesService.create(createCompanyInput, user);
  }

  @Query(() => [Company], {
    name: 'companies',
    description: 'Returns all of the registered companies or talacheros'
  })
  findAll(
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ) {
    return this.companiesService.findAll();
  }

  @Query(() => Company, {
    name: 'company',
    description: 'Returns a single specific record queried by ID'
  })
  findOne(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ) {
    return this.companiesService.findOne(id);
  }

  @Mutation(() => Company, {
    name: 'updateCompany',
    description: 'Update the data of a specific company'
  })
  updateCompany(
    @Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ) {
    return this.companiesService.update(updateCompanyInput.id, updateCompanyInput, user);
  }

  @Mutation(() => Company, {
    name: 'blockCompany',
    description: 'Inactivates a company by passing the company ID as a parameter'
  })
  blockCompany(
    @Args('id', { type: () => Int }, ParseIntPipe) id: number,
    @CurrentUser([UserRoles.Administrador, UserRoles.superAdmin]) user: User
  ) {
    return this.companiesService.block(id, user);
  }
}
