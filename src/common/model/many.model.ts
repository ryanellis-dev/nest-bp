import { mixin } from '@nestjs/common';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

type Constructor<T = unknown> = new (...args: any[]) => T;

export function withMany<TBase extends Constructor>(
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

// export class Paginated<T> extends Many<T> {
//   @Expose() total: number;
//   @Expose() limit: number;
//   @Expose() offset: number;
// }
