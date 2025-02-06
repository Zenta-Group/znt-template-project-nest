import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AxiosService } from './axios.service';
import { SecurityType, ISecurityConfig } from '../config/axios.configuration';

@Module({
  imports: [ConfigModule],
  providers: [
    {
      provide: 'EXTERNAL_API_SERVICE',
      useFactory: (configService: ConfigService) => {
        const baseUrl = configService.get<string>('externalApiBaseUrl');
        const securityType = configService.get<SecurityType>(
          'externalApiSecurityType',
        );
        const apiKey = configService.get<string>('externalApiKey');
        const token = configService.get<string>('externalApiToken');

        const securityConfig: ISecurityConfig = {
          type: securityType,
          apiKey: securityType === SecurityType.API_KEY ? apiKey : undefined,
          token: securityType === SecurityType.BEARER_TOKEN ? token : undefined,
        };

        return new AxiosService(baseUrl, securityConfig);
      },
      inject: [ConfigService],
    },
  ],
  exports: ['EXTERNAL_API_SERVICE'],
})
export class IntegrationModule {}
