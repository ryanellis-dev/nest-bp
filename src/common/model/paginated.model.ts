import { mixin } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { MAX_LIMIT } from '../consts/pagination';

type Constructor<T = unknown> = new (...args: any[]) => T;

export function Paginated<TBase extends Constructor>(
  Base: TBase,
  options?: ApiPropertyOptions,
) {
  class Paginated {
    @Expose()
    @ApiProperty({
      minimum: 1,
      maximum: MAX_LIMIT,
    })
    limit: number;

    @Expose()
    @ApiProperty({
      minimum: 0,
    })
    offset: number;

    @Expose()
    @ApiProperty({
      minimum: 0,
    })
    total: number;

    @Expose()
    @ApiProperty({
      isArray: true,
      type: Base,
      ...options,
    })
    @Type(() => Base)
    results: Array<InstanceType<TBase>>;
  }

  return mixin(Paginated);
}
