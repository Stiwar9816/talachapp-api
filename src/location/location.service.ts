import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity/Input
import { CreateLocationInput } from './dto';
import { User } from 'src/users/entities/user.entity';
import { Location } from './entities/location.entity';

@Injectable()
export class LocationService {
  private readonly logger = new Logger('LocationServices');

  constructor(
    @InjectRepository(Location)
    private readonly locationRepository: Repository<Location>,
  ) {}

  async create(
    createLocationInput: CreateLocationInput,
    user: User,
  ): Promise<Location> {
    try {
      const newLocation = this.locationRepository.create({
        ...createLocationInput,
        user,
      });
      return await this.locationRepository.save(newLocation);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  findAll(): Promise<Location[]> {
    return this.locationRepository.find();
  }

  async findOne(id: string): Promise<Location> {
    try {
      const query = await this.locationRepository
        .createQueryBuilder('locations')
        .leftJoinAndSelect('locations.user', 'idUser')
        .where('locations.idUser =:idUser', { idUser: id })
        .getOne();

      this.handleDBNotFound(query, id);

      return query;
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`,
      });
    }
  }

  async remove(id: string): Promise<Location> {
    const location = await this.findOne(id);
    this.handleDBNotFound(location, id);
    try {
      await this.locationRepository
        .createQueryBuilder('locations')
        .delete()
        .from(Location)
        .where('idUser=:id', { id: location.user.id })
        .execute();
      return location;
    } catch (error) {
      this.handleDBException(error);
    }
  }

  // Manejo de excepciones
  private handleDBException(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Unexpected error, check server logs',
    );
  }

  private handleDBNotFound(location: Location, id: string) {
    if (!location)
      throw new NotFoundException(`Location with id ${id} not found`);
  }
}
