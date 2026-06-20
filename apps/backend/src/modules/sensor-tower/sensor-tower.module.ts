import { Module } from '@nestjs/common';
import { SensorTowerController } from './sensor-tower.controller';
import { SensorTowerService } from './sensor-tower.service';

@Module({
  controllers: [SensorTowerController],
  providers: [SensorTowerService],
  exports: [SensorTowerService],
})
export class SensorTowerModule {}
