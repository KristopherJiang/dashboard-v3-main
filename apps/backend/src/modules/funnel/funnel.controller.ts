import { Controller, Get, Query } from '@nestjs/common';
import type { BaseQueryDto } from '../../common/dto/query.dto';
import { FunnelService } from './funnel.service';

@Controller('funnel')
export class FunnelController {
  constructor(private readonly funnelService: FunnelService) {}

  @Get()
  async getFunnel(@Query() query: BaseQueryDto) {
    return this.funnelService.getFunnelData(
      query.timeRange ?? 'mtd',
      query.region ?? 'GLOBAL',
    );
  }
}
