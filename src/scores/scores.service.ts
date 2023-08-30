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
import { CreateScoreInput, UpdateScoreInput } from './dto';
import { Score } from './entities/score.entity';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class ScoresService {
  private readonly logger = new Logger('ScoresServices');

  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>,
  ) {}

  async create(
    createScoreInput: CreateScoreInput,
    userID: User,
  ): Promise<Score> {
    try {
      const newScore = await this.scoreRepository.create(createScoreInput);
      newScore.user = userID;
      return await this.scoreRepository.save(newScore);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async findAll(): Promise<Score[]> {
    return await this.scoreRepository.find({ relations: ['user'] });
  }

  async findOne(id: string): Promise<Score> {
    try {
      return await this.scoreRepository.findOneByOrFail({ id });
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} no encontrado`,
      });
    }
  }

  async update(
    id: string,
    updateScoreInput: UpdateScoreInput,
    updateBy: User,
  ): Promise<Score> {
    try {
      const score = await this.scoreRepository.preload({
        id,
        ...updateScoreInput,
      });
      score.lastUpdateBy = updateBy;
      return await this.scoreRepository.save(score);
    } catch (error) {
      this.handleDBException(error);
    }
  }

  async remove(id: string): Promise<Score> {
    const score = await this.findOne(id);
    return await this.scoreRepository.remove(score);
  }

  // Manejo de excepciones
  private handleDBException(error: any): never {
    if (error.code === '23505')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    if (error.code === 'error-001')
      throw new BadRequestException(error.detail.replace('Key ', ''));

    this.logger.error(error);
    throw new InternalServerErrorException(
      'Error inesperado, verifique los registros del servidor',
    );
  }
}
