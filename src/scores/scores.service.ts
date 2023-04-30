import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
// TypeORM
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
// Entity/Input
import { CreateScoreInput, UpdateScoreInput } from './dto';
import { Score } from './entities/score.entity';

@Injectable()
export class ScoresService {

  private readonly logger = new Logger('ScoresServices')

  constructor(
    @InjectRepository(Score)
    private readonly scoreRepository: Repository<Score>
  ) { }

  async create(createScoreInput: CreateScoreInput): Promise<Score> {
    try {
      const newScore = await this.scoreRepository.create(createScoreInput)
      return await this.scoreRepository.save(newScore)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async findAll(): Promise<Score[]> {
    return await this.scoreRepository.find()
  }

  async findOne(id: number): Promise<Score> {
    try {
      return await this.scoreRepository.findOneByOrFail({ id })
    } catch (error) {
      this.handleDBException({
        code: 'error-001',
        detail: `${id} not found`
      })
    }
  }

  async update(id: number, updateScoreInput: UpdateScoreInput): Promise<Score> {
    const score = await this.findOne(id)
    this.handleDBNotFound(score, id)
    try {
      return await this.scoreRepository.save(score)
    } catch (error) {
      this.handleDBException(error)
    }
  }

  async remove(id: number): Promise<Score> {
    const score = await this.findOne(id)
    return await this.scoreRepository.remove(score)
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

  private handleDBNotFound(score: Score, id: number) {
    if (!score) throw new NotFoundException(`Score with id ${id} not found`)
  }
}
