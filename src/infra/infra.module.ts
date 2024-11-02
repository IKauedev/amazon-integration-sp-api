import { Module } from '@nestjs/common';
import { HttpModule } from '@infra/http/http.module';
import { LoggerModule } from '@infra/logger/logger.module';
import { AmazonModule } from './amazon/amazon.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { MailerConfigModule } from './mailer/mailer.config.module';

@Module({
  imports: [
    HttpModule,
    LoggerModule,
    AmazonModule,
    MailerConfigModule,
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
      path: 'metrics'
    }),
  ],
  providers: [],
  exports: [],
})
export class InfraModule {}
