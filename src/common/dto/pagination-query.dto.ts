import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';
import { DEFAULT_LIMIT, MAX_LIMIT } from '../consts/pagination';

export class PaginationQueryDto {
  @ApiPropertyOptional({
    minimum: 1,
    maximum: MAX_LIMIT,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  @Type(() => Number)
  limit: number = DEFAULT_LIMIT;

  @ApiPropertyOptional({
    minimum: 0,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number = 0;
}
