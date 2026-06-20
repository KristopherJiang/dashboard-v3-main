import { Controller, Get, Query } from '@nestjs/common';
import type { BaseQueryDto } from '../../common/dto/query.dto';
import { MarketIntelligenceService } from './market-intelligence.service';

@Controller('market-intelligence')
export class MarketIntelligenceController {
  constructor(
    private readonly marketIntelligenceService: MarketIntelligenceService,
  ) {}

  @Get()
  async getMarketIntelligence(@Query() query: BaseQueryDto) {
    return this.marketIntelligenceService.getMarketIntelligenceData(
      query.timeRange ?? 'mtd',
      query.region ?? 'GLOBAL',
    );
  }
}
