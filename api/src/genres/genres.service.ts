import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateGenreDto } from './dto/create-genre.dto.js';
import { UpdateGenreDto } from './dto/update-genre.dto.js';

@Injectable()
export class GenresService {
  constructor(private prisma: PrismaService) {}

  // Create a genre
  async create(createGenreDto: CreateGenreDto) {
    return this.prisma.genre.create({
      data: createGenreDto,
    });
  }

  // Get all genres
  async findAll() {
    return this.prisma.genre.findMany();
  }

  // Get one genre
  async findOne(id: number) {
    const genre = await this.prisma.genre.findUnique({
      where: { id },
    });

    if (!genre) {
      throw new NotFoundException(
        `Genre with ID ${id} not found`,
      );
    }

    return genre;
  }

  // Update a genre
  async update(id: number, updateGenreDto: UpdateGenreDto) {
    await this.findOne(id);

    return this.prisma.genre.update({
      where: { id },
      data: updateGenreDto,
    });
  }

  // Delete a genre
  async remove(id: number) {
    await this.findOne(id);

    return this.prisma.genre.delete({
      where: { id },
    });
  }
}