import { Controller, Get, Query } from '@nestjs/common';
import type { BaseQueryDto } from '../../common/dto/query.dto';
import { UsersService } from './users.service';
import { UsersDemographicsService } from './users-demographics.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersDemographicsService: UsersDemographicsService,
  ) {}

  @Get('distribution')
  async getDistribution(@Query() query: BaseQueryDto) {
    return this.usersService.getDistributionData(
      query.timeRange ?? 'mtd',
      query.region ?? 'GLOBAL',
    );
  }

  @Get('demographics')
  async getDemographics(@Query() query: BaseQueryDto) {
    return this.usersDemographicsService.getDemographicsData(
      query.timeRange ?? 'mtd',
      query.region ?? 'GLOBAL',
    );
  }
}
