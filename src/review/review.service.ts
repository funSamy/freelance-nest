import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        rating: Number(createReviewDto.rating),
      },
      include: {
        contract: {
          include: {
            proposal: {
              include: {
                freelancer: true,
                job: {
                  include: {
                    client: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  async findAll(filters?: { contractId?: string; reviewerId?: string }) {
    const where: any = {};

    if (filters?.contractId) {
      where.contractId = filters.contractId;
    }

    if (filters?.reviewerId) {
      where.reviewerId = filters.reviewerId;
    }

    return this.prisma.review.findMany({
      where,
      include: {
        contract: {
          include: {
            proposal: {
              include: {
                freelancer: true,
                job: {
                  include: {
                    client: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        contract: {
          include: {
            proposal: {
              include: {
                freelancer: true,
                job: {
                  include: {
                    client: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(`Review with ID ${id} not found`);
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto) {
    // First check if the review exists
    await this.findOne(id);

    return this.prisma.review.update({
      where: { id },
      data: updateReviewDto,
      include: {
        contract: true,
      },
    });
  }

  async remove(id: string) {
    // First check if the review exists
    await this.findOne(id);

    return this.prisma.review.delete({
      where: { id },
    });
  }

  async findByContract(contractId: string) {
    return this.findAll({ contractId });
  }

  async findByReviewer(reviewerId: string) {
    return this.findAll({ reviewerId });
  }
}
