import { Module } from '@nestjs/common';
import { MarketCommandController } from './market-command.controller';
import { MarketCommandService } from './market-command.service';

@Module({
  controllers: [MarketCommandController],
  providers: [MarketCommandService],
  exports: [MarketCommandService],
})
export class MarketCommandModule {}
