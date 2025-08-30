import { Logger, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Module({
  providers: [
    {
      provide: PrismaService,
      useFactory: () => {
        const prisma = new PrismaService();

        return prisma.$extends({
          query: {
            $allModels: {
              async $allOperations({ operation, model, args, query }) {
                const start = performance.now();
                const result = await query(args);
                const duration = +(performance.now() - start).toFixed(2);
                Logger.debug(
                  {
                    msg: `Prisma query ${operation} on ${model} took ${duration}ms`,
                    model,
                    operation,
                    args,
                    query,
                  },
                  'Prisma',
                );
                return result;
              },
            },
          },
        });
      },
    },
  ],
  exports: [PrismaService],
})
export class PrismaModule {}
