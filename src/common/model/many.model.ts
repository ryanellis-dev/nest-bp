import { mixin } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

type Constructor<T = unknown> = new (...args: any[]) => T;

export function Many<TBase extends Constructor>(
  Base: TBase,
  options?: ApiPropertyOptions,
) {
  class Many {
    @Expose()
    @ApiProperty({
      isArray: true,
      type: Base,
      ...options,
    })
    @Type(() => Base)
    results: Array<InstanceType<TBase>>;
  }

  return mixin(Many);
}
