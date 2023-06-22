import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateLocationInput, UpdateLocationInput } from './dto';
import { User } from 'src/users/entities/user.entity';
import { Location } from './entities/location.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class LocationService {
  private readonly logger= new Logger('LocationServices');

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>
  ){}

 async create(createLocationInput: CreateLocationInput, user:User) {
   try {
    const newLocation = this.locationRepository.create({...createLocationInput, user})
    return await this.locationRepository.save(newLocation)
   } catch (error) {
    this.handleDBException(error)
   }
  }

  findAll() {
    return `This action returns all location`;
  }

  async findOne(id: number ) {
    try {
      const query = await this.locationRepository.createQueryBuilder('locations')
      .leftJoinAndSelect('locations.user', 'idUser')
      .where('locations.idUser =:idUser', { idUser: id})
      .getOne();
      return query
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }
  }

  update(id: number, updateLocationInput: UpdateLocationInput) {
    return `This action updates a #${id} location`;
  }

 async remove(id: number) {
    const location = await this.findOne(id)
    try {
      await this.locationRepository.createQueryBuilder('locations')
        .delete()
        .from(Location)
        .where("idUser=:id", {id: id})
        .execute()
      return 'Location deleted'
    } catch (error) {
      this.handleDBException(error)
    }
  }

  // Manejo de excepciones
  private handleDBException(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''))

    if (error.code === 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''))

    this.logger.error(error)
    throw new InternalServerErrorException('Unexpected error, check server logs')
  }

  private handleDBNotFound(location: Location, id: number) {
    if (!location) throw new NotFoundException(`Price with id ${id} not found`)
  }
}
