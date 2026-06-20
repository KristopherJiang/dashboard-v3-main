import { IsOptional, IsString, IsEnum } from 'class-validator';

export enum TimeRange {
  TODAY = 'today',
  YESTERDAY = 'yesterday',
  THIS_WEEK = 'thisWeek',
  MTD = 'mtd',
  LAST_MONTH = 'lastMonth',
  YTD = 'ytd',
  LAST_90 = 'last90',
  CUSTOM = 'custom',
}

export class BaseQueryDto {
  @IsEnum(TimeRange)
  @IsOptional()
  timeRange?: TimeRange = TimeRange.MTD;

  @IsString()
  @IsOptional()
  region?: string = 'GLOBAL';

  @IsString()
  @IsOptional()
  startDate?: string;

  @IsString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  granularity?: string = 'daily';
}
