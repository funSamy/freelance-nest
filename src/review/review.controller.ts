import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { ReviewService } from './review.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/create-review.dto';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  findAll(@Query('contractId') contractId?: string, @Query('reviewerId') reviewerId?: string) {
    return this.reviewService.findAll({ contractId, reviewerId });
  }

  @Get('contract/:contractId')
  findByContract(@Param('contractId') contractId: string) {
    return this.reviewService.findByContract(contractId);
  }

  @Get('reviewer/:reviewerId')
  findByReviewer(@Param('reviewerId') reviewerId: string) {
    return this.reviewService.findByReviewer(reviewerId);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, updateReviewDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.reviewService.remove(id);
  }
}
