import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AmazonService } from './service/amazon-sp.service';
import { AmazonScrapperService } from './service/amazon-scrapper.service';
import { AmazonProduct } from 'amazon-product-scrapper';
import { ExcelModule } from '@infra/excel/excel.module';
import { Counter } from 'prom-client';

@Module({
  imports: [
    ExcelModule,
    ConfigModule.forRoot(),
  ],
  providers: [
    {
      provide: AmazonProduct,
      useFactory: () => new AmazonProduct(),
    },
    AmazonScrapperService,
    {
      provide: AmazonService,
      useFactory: (configService: ConfigService) => {
        const clientId = configService.get<string>('SELLING_PARTNER_APP_CLIENT_ID');
        const clientSecret = configService.get<string>('SELLING_PARTNER_APP_CLIENT_SECRET');
        const region = configService.get<string>('AMAZON_REGION') as "na" || "fe" || "eu";

        if (!clientId || !clientSecret) {
          throw new Error('Amazon SP API credentials are missing');
        }

        return new AmazonService({
          region,
          credentials: {
            SELLING_PARTNER_APP_CLIENT_ID: clientId,
            SELLING_PARTNER_APP_CLIENT_SECRET: clientSecret,
          },
          options: {
            only_grantless_operations: true,
            auto_request_tokens: true,
            use_sandbox: true,
            user_agent: 'amazon-sp-api/(Language=Node.js;/; Platform=/)',
          },
        });
      },
      inject: [ConfigService],
    },
    {
      provide: 'AMAZON_EXTRACT_COUNTER',
      useFactory: () => {
        const counter = new Counter({
          name: 'amazon_extract_requests_total',
          help: 'Total number of extract requests to Amazon',
          labelNames: ['status'],
        });
        return counter;
      },
    },
  ],
  exports: [AmazonService, AmazonScrapperService],
})
export class AmazonModule {}
