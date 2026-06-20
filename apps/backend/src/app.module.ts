import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { KpiModule } from './modules/kpi/kpi.module';
import { ChannelsModule } from './modules/channels/channels.module';
import { UsersModule } from './modules/users/users.module';
import { FunnelModule } from './modules/funnel/funnel.module';
import { ReputationModule } from './modules/reputation/reputation.module';
import { AppMarketModule } from './modules/app-market/app-market.module';
import { HealthModule } from './modules/health/health.module';
import { MarketIntelligenceModule } from './modules/market-intelligence/market-intelligence.module';
import { AsoModule } from './modules/aso/aso.module';
import { MarketCommandModule } from './modules/market-command/market-command.module';
import { AiModule } from './modules/ai/ai.module';
import { MarketingModule } from './modules/marketing/marketing.module';

@Module({
  imports: [
    PrismaModule,
    KpiModule,
    ChannelsModule,
    UsersModule,
    FunnelModule,
    ReputationModule,
    AppMarketModule,
    HealthModule,
    MarketIntelligenceModule,
    AsoModule,
    MarketCommandModule,
    AiModule,
    MarketingModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
