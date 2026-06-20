import { Controller, Get, Query } from '@nestjs/common';
import type { BaseQueryDto } from '../../common/dto/query.dto';
import { AsoService } from './aso.service';

@Controller('aso')
export class AsoController {
  constructor(private readonly asoService: AsoService) {}

  @Get()
  async getASO(@Query() query: BaseQueryDto) {
    return this.asoService.getASOData(
      query.timeRange ?? 'mtd',
      query.region ?? 'GLOBAL',
    );
  }
}
