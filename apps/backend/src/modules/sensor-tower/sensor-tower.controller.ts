import { Controller, Get, Query } from '@nestjs/common';
import { SensorTowerService } from './sensor-tower.service';

export class SensorTowerQueryDto {
  platform?: 'ios' | 'android' | 'all';
  start_date?: string;
  end_date?: string;
  countries?: string;
}

@Controller('sensortower')
export class SensorTowerController {
  constructor(private readonly sensorTowerService: SensorTowerService) {}

  @Get('metrics')
  async getMetrics(@Query() query: SensorTowerQueryDto) {
    return this.sensorTowerService.getMetrics({
      platform: query.platform ?? 'all',
      start_date: query.start_date ?? '',
      end_date: query.end_date ?? '',
      countries: query.countries,
    });
  }
}
