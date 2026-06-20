import { Controller, Get, Query } from '@nestjs/common';
import type { BaseQueryDto } from '../../common/dto/query.dto';
import { MarketCommandService } from './market-command.service';

@Controller('market')
export class MarketCommandController {
  constructor(private readonly marketCommandService: MarketCommandService) {}

  @Get('command')
  async getMarketCommand(@Query() query: BaseQueryDto) {
    return this.marketCommandService.getMarketCommandData(
      query.timeRange ?? 'mtd',
      query.region ?? 'GLOBAL',
    );
  }
}
