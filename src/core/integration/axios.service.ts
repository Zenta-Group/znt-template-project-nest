import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { IIntegrationService } from '../../shared/interfaces/i-integration-service.interface';
import {
  InvalidEndpointException,
  ResourceNotFoundException,
  UnauthorizedAccessException,
  BadRequestException,
  InternalServerErrorException,
  IntegrationException,
} from '../../shared/exceptions/integration-exceptions';
import { ISecurityConfig, SecurityType } from '../config/axios.configuration';
import { GoogleAuth } from 'google-auth-library';

@Injectable()
export class AxiosService<T> implements IIntegrationService<T> {
  private readonly logger = new Logger('AxiosService');
  private readonly axiosInstance: AxiosInstance;
  private readonly googleAuth = new GoogleAuth();

  constructor(
    private readonly baseUrl: string,
    private readonly securityConfig: ISecurityConfig,
  ) {
    this.axiosInstance = axios.create({
      baseURL: baseUrl,
    });
  }

  onModuleInit() {
    this.setupAuthenticationInterceptor();
  }

  private setupAuthenticationInterceptor(): void {
    switch (this.securityConfig.type) {
      case SecurityType.API_KEY:
        if (!this.securityConfig.apiKey) {
          throw new Error('API Key no proporcionada.');
        }
        this.axiosInstance.defaults.headers.common['x-api-key'] =
          this.securityConfig.apiKey;
        break;
      case SecurityType.BEARER_TOKEN:
        if (!this.securityConfig.token) {
          throw new Error('Token JWT no proporcionado.');
        }
        this.axiosInstance.defaults.headers.common['Authorization'] =
          `Bearer ${this.securityConfig.token}`;
        break;
      case SecurityType.GOOGLE_CLOUD_RUN_AUTH:
        if (this.securityConfig.cloudRunIdToken) {
          this.axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${this.securityConfig.cloudRunIdToken}`;
          this.logger.log('Using local ID token for Cloud Run authentication.');
        } else {
          // Lógica para Cloud Run real (producción)
          if (!this.securityConfig.cloudRunTargetUrl) {
            throw new Error('URL de destino de Cloud Run no proporcionada.');
          }
          this.axiosInstance.interceptors.request.use(async (config) => {
            try {
              const client = await new GoogleAuth().getIdTokenClient(
                this.securityConfig.cloudRunTargetUrl,
              );
              const headers = await client.getRequestHeaders();
              const authHeader =
                headers['authorization'] || headers['Authorization'];
              if (authHeader) {
                config.headers.Authorization = authHeader;
              }
            } catch (error) {
              this.logger.error(
                'Error obtaining ID token for Cloud Run:',
                error,
              );
            }
            return config;
          });
          this.logger.log(
            'Configured Cloud Run authentication for production environment.',
          );
        }
        break;
      case SecurityType.NONE:
        break;
      default:
        throw new Error('Tipo de seguridad no válido.');
    }
  }

  async get(endpoint: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await this.axiosInstance.get(endpoint, { params });
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, endpoint);
    }
  }

  async post(endpoint: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.post(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, endpoint);
    }
  }

  async put(endpoint: string, data: any): Promise<T> {
    try {
      const response = await this.axiosInstance.put(endpoint, data);
      return response.data;
    } catch (error) {
      this.handleAxiosError(error, endpoint);
    }
  }

  async delete(endpoint: string): Promise<void> {
    try {
      await this.axiosInstance.delete(endpoint);
    } catch (error) {
      this.handleAxiosError(error, endpoint);
    }
  }

  private handleAxiosError(error: any, endpoint: string): never {
    this.logger.error(
      `Error en solicitud HTTP (${endpoint}): ${error.message}`,
      error.stack,
    );

    if (error.response) {
      const { status, data } = error.response;
      switch (status) {
        case 400:
          throw new BadRequestException(data?.message);
        case 401:
          throw new UnauthorizedAccessException();
        case 404:
          throw new ResourceNotFoundException(endpoint);
        case 500:
          throw new InternalServerErrorException(data?.message);
        default:
          throw new IntegrationException(
            `Error HTTP desconocido (${status}).`,
            status,
          );
      }
    } else if (error.request) {
      throw new InvalidEndpointException(endpoint);
    } else {
      throw new IntegrationException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
