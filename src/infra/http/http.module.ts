import { Module } from '@nestjs/common';
import { UseCasesModule } from '@application/use-cases/user-case.module';
import { AmazonExternalController } from './controller/amazon.external.controller';
import { AmazonExtractProductController } from './controller/amazon.extract.scrapper.controller';
import { MetricsModule } from '@infra/metrics/metrics.module';

@Module({
  imports: [
    UseCasesModule,
    MetricsModule,
  ],
  controllers: [
    AmazonExternalController,
    AmazonExtractProductController
  ],
  providers: [],
})
export class HttpModule {}
