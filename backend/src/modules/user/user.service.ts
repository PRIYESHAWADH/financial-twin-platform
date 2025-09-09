import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../common/services/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          role: createUserDto.role as any,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          pan: true,
          isVerified: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async findAll(pagination: PaginationDto): Promise<{
    users: UserResponseDto[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          pan: true,
          isVerified: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      users,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<UserResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        pan: true,
        isVerified: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: {
          ...updateUserDto,
          role: updateUserDto.role as any,
        },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          pan: true,
          isVerified: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      return user;
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      if (error.code === 'P2002') {
        throw new ConflictException('User with this email already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
