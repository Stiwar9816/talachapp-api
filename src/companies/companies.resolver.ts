import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { CompaniesService } from './companies.service';
import { Company } from './entities/company.entity';
import { CreateCompanyInput } from './dto/inputs/create-company.input';
import { UpdateCompanyInput } from './dto/inputs/update-company.input';
import { ParseIntPipe } from '@nestjs/common';

@Resolver(() => Company)
export class CompaniesResolver {
  constructor(private readonly companiesService: CompaniesService) { }

  @Mutation(() => Company)
  createCompany(@Args('createCompanyInput') createCompanyInput: CreateCompanyInput) {
    return this.companiesService.create(createCompanyInput);
  }

  @Query(() => [Company], { name: 'companies' })
  findAll() {
    return this.companiesService.findAll();
  }

  @Query(() => Company, { name: 'company' })
  findOne(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.companiesService.findOne(id);
  }

  @Mutation(() => Company, { name: 'updateCompany' })
  updateCompany(@Args('updateCompanyInput') updateCompanyInput: UpdateCompanyInput) {
    return this.companiesService.update(updateCompanyInput.id, updateCompanyInput);
  }

  @Mutation(() => Company, { name: 'removeCompany' })
  removeCompany(@Args('id', { type: () => Int }, ParseIntPipe) id: number) {
    return this.companiesService.remove(id);
  }
}
