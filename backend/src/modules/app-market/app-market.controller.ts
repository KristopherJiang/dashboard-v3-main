import { Controller, Get, Query } from '@nestjs/common';
import type { BaseQueryDto } from '../../common/dto/query.dto';
import { AppMarketService } from './app-market.service';

@Controller('app-market')
export class AppMarketController {
  constructor(private readonly appMarketService: AppMarketService) {}

  @Get()
  async getAppMarket(@Query() query: BaseQueryDto) {
    return this.appMarketService.getAppMarketData(
      query.timeRange ?? 'mtd',
      query.region ?? 'GLOBAL',
    );
  }
}
