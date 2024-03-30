import { SetMetadata, applyDecorators } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

export const BYPASS_AUTH_KEY = 'bypassAuth';
export const BypassAuth = () =>
  applyDecorators(
    SetMetadata(BYPASS_AUTH_KEY, true),
    ApiOperation({ security: [] }, { overrideExisting: true }),
  );
