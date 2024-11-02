import { Module } from '@nestjs/common';
import { Counter } from 'prom-client';

export const AMAZON_EXTRACT_COUNTER = new Counter({
  name: 'amazon_extract_counter',
  help: 'Contador de extrações de produtos do Amazon',
  labelNames: ['status'],
});

@Module({
  providers: [
    {
      provide: 'AMAZON_EXTRACT_COUNTER',
      useValue: AMAZON_EXTRACT_COUNTER,
    },
  ],
  exports: ['AMAZON_EXTRACT_COUNTER'],
})
export class MetricsModule {}
