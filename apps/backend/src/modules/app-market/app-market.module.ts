import { Module } from '@nestjs/common';
import { AppMarketController } from './app-market.controller';
import { AppMarketService } from './app-market.service';

@Module({
  controllers: [AppMarketController],
  providers: [AppMarketService],
  exports: [AppMarketService],
})
export class AppMarketModule {}
