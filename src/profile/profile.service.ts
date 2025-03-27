import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProfileDto } from './dto/create-profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { isMongoId } from 'class-validator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createProfileDto: CreateProfileDto) {
    const profile = await this.prismaService.profile.create({
      data: createProfileDto,
      select: {
        verificationStatus: true,
        userId: true,
        bio: true,
        mobileMoneyNumber: true,
        bankAccountNumber: true,
        nationalIdUrl: true,
        location: true,
      },
    });
    return profile;
  }

  async findAll() {
    const profiles = await this.prismaService.profile.findMany({});
    return profiles;
  }

  async findOne(id: string) {
    if (!isMongoId(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    const profile = await this.prismaService.profile.findUnique({
      where: { userId: id },
      select: {
        verificationStatus: true,
        userId: true,
        bio: true,
        mobileMoneyNumber: true,
        bankAccountNumber: true,
        nationalIdUrl: true,
        location: true,
      },
    });
    if (!profile) {
      throw new NotFoundException('Profile not found');
    }
    return profile;
  }

  async update(id: string, updateProfileDto: UpdateProfileDto) {
    if (!isMongoId(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    const updatedProfile = await this.prismaService.profile.update({
      where: { userId: id },
      data: updateProfileDto,
      select: {
        verificationStatus: true,
        userId: true,
        bio: true,
        mobileMoneyNumber: true,
        bankAccountNumber: true,
        nationalIdUrl: true,
        location: true,
      },
    });
    if (!updatedProfile) {
      throw new NotFoundException('Profile not found');
    }
    return updatedProfile;
  }

  async remove(id: string) {
    if (!isMongoId(id)) {
      throw new BadRequestException('Invalid user ID');
    }
    const deletedProfile = await this.prismaService.profile.delete({
      where: { userId: id },
      select: {
        verificationStatus: true,
        userId: true,
        bio: true,
        mobileMoneyNumber: true,
        bankAccountNumber: true,
        nationalIdUrl: true,
        location: true,
      },
    });
    if (!deletedProfile) {
      throw new NotFoundException('Profile not found');
    }
    return;
  }
}
