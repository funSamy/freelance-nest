import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { hash } from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }

    const hashedPassword = await hash(createUserDto.password, 10);

    // create user with profile
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        passwordHash: hashedPassword,
        profile: {
          create: {},
        },
      },
      select: {
        id: true,
        email: true,
        role: true,
        lastLogin: true,
        profile: {
          select: {
            mobileMoneyNumber: true,
            bankAccountNumber: true,
            bio: true,
            location: true,
            nationalIdUrl: true,
            verificationStatus: true,
          },
        },
      },
    });

    return user;
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });

      return user;
    } catch (error) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }

  async remove(id: string) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
  }
}
