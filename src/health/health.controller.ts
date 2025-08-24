import { TransactionHost } from '@nestjs-cls/transactional';
import { TransactionalAdapterPrisma } from '@nestjs-cls/transactional-adapter-prisma';
import { Controller, Get, VERSION_NEUTRAL } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  HealthCheck,
  HealthCheckService,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
} from '@nestjs/terminus';
import { BypassAuth } from 'src/common/decorators/bypass-auth.decorator';

@ApiTags('health')
@Controller({
  path: 'health',
  version: VERSION_NEUTRAL,
})
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private prismaHealth: PrismaHealthIndicator,
    private txHost: TransactionHost<TransactionalAdapterPrisma>,
    private memory: MemoryHealthIndicator,
  ) {}

  @BypassAuth()
  @HealthCheck()
  @Get()
  check() {
    return this.health.check([
      () => this.prismaHealth.pingCheck('database', this.txHost.tx),
      () => this.memory.checkHeap('memory_heap', 150 * 1024 * 1024),
    ]);
  }
}
