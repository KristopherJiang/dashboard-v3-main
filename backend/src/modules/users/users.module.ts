import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersDemographicsService } from './users-demographics.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UsersDemographicsService],
  exports: [UsersService, UsersDemographicsService],
})
export class UsersModule {}
