# **ZNT Template Project - NestJS**

Este es un proyecto base construido con **NestJS** que sigue los principios de **Arquitectura Hexagonal**, **SOLID** y **buenas prácticas de desarrollo**. Está diseñado para ser utilizado como plantilla para nuevos proyectos, permitiendo una rápida configuración y escalabilidad.

## 📋 **Tabla de Contenidos**

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Arquitectura del Proyecto](#arquitectura-del-proyecto)
4. [Estructura del Proyecto](#estructura-del-proyecto)
5. [Adapters de Base de Datos](#adapters-de-base-de-datos)
6. [Servicio de Integración Axios](#servicio-de-integración-axios)
7. [Principios y Buenas Prácticas](#principios-y-buenas-prácticas)
8. [Variables de Entorno](#variables-de-entorno)
9. [Comandos Disponibles](#comandos-disponibles)
10. [Testing](#testing)
11. [SonarQube](#sonarqube)
12. [Swagger](#swagger)
13. [Docker y Cloud Run](#docker-y-cloud-run)
14. [Custom Logger](#custom-logger)
15. [Validaciones de Seguridad](#validaciones-de-seguridad)
16. [Distribución y Despliegue](#distribución-y-despliegue)
17. [Contribuciones](#contribuciones)
18. [Recursos Adicionales](#recursos-adicionales)

---

## 🛠️ **Requisitos Previos**

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- **Node.js** (v18.x o superior)
- **npm** (v9.x o superior)
- **Docker** (para contenedores y despliegue)
- **Google Cloud SDK** (para integración con Google Cloud)
- **MySQL** (si usas el adapter TypeORM)
- **Postman** u otra herramienta similar para probar las APIs

---

## 🔧 **Instalación y Configuración**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Zenta-Group/znt-template-project-nest.git
cd znt-template-project-nest
```

### 2. Instalar Dependencias

```bash
npm install
```

### 3. Configurar el nombre del artefacto

Actualiza el nombre del proyecto en `package.json`:

```json
{
  "name": "client-namesystem-back"
}
```

### 4. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables:

```env
# Configuración de la aplicación
APP_PORT=3000
LIST_CORS=http://localhost:4200,http://localhost:3000
SECRETKEY_AUTH=tu-clave-secreta-muy-segura
TOKEN_EXPIRATION=3600
LOG_LEVEL=debug
NODE_ENV=development

# Configuración de Google Cloud
GOOGLE_CLIENT_ID=tu-client-id-google.apps.googleusercontent.com
GCP_PROJECT_ID=tu-proyecto-gcp
GCP_FIRESTORE_DATABASE_ID=tu-base-de-datos-firestore

# Configuración de Base de Datos MySQL (TypeORM)
DB_HOST=localhost
DB_PORT=3306
DB_USER=usuario
DB_PASS=contraseña
DB_DB=nombre_base_datos

# Configuración de API Externa
EXTERNAL_API_BASE_URL=https://api.ejemplo.com
EXTERNAL_API_SECURITY_TYPE=none # none | api-key | bearer-token | google-cloud-run-auth
EXTERNAL_API_KEY=tu-api-key
EXTERNAL_API_TOKEN=tu-token-jwt

# Configuración Cloud Run (para comunicación entre servicios)
CLOUD_RUN_TARGET_URL=https://tu-servicio.run.app
CLOUD_RUN_API_BASE_URL=https://tu-servicio.run.app/api/v1
```

#### 4.1 Ejemplo de Configuración Mínima

```env
APP_PORT=3000
LIST_CORS=http://localhost:4200,http://localhost:3000
TOKEN_EXPIRATION=3600
SECRETKEY_AUTH=mi-clave-super-secreta-2025
EXTERNAL_API_SECURITY_TYPE=none
LOG_LEVEL=info
NODE_ENV=development
```

### 5. Ejecutar el Proyecto

Para iniciar el proyecto en modo desarrollo:

```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000` y la documentación Swagger en `http://localhost:3000/api/v1/zenta/swagger-doc`.

---

## 🏗️ **Arquitectura del Proyecto**

Este proyecto implementa **Arquitectura Hexagonal** (también conocida como Ports & Adapters), que proporciona las siguientes ventajas:

### **Principios Arquitectónicos**

1. **Separación de Responsabilidades**: Cada capa tiene una responsabilidad específica
2. **Inversión de Dependencias**: Las capas internas no dependen de las externas
3. **Testabilidad**: Cada componente puede ser probado de forma aislada
4. **Flexibilidad**: Fácil intercambio de implementaciones (bases de datos, APIs externas)

### **Capas de la Arquitectura**

```
┌─────────────────────────────────────────────────────────────┐
│                    INFRASTRUCTURE LAYER                     │
│  Controllers, Database Adapters, External APIs, Configs     │
├─────────────────────────────────────────────────────────────┤
│                    APPLICATION LAYER                        │
│         Services, Use Cases, Business Logic                 │
├─────────────────────────────────────────────────────────────┤
│                      DOMAIN LAYER                          │
│     Entities, Value Objects, Interfaces, Business Rules    │
└─────────────────────────────────────────────────────────────┘
```

### **Adaptadores Implementados**

- **Database Adapters**: Firestore y TypeORM (MySQL)
- **Integration Adapters**: Axios con múltiples tipos de autenticación
- **Security Adapters**: JWT, Google Auth, CSRF Protection

---

## 📂 **Estructura del Proyecto**

La estructura del proyecto está organizada siguiendo los principios de modularidad y separación de responsabilidades:

```
src/
├── app.module.ts           # Módulo principal de la aplicación
├── main.ts                # Punto de entrada de la aplicación
├── auth/                  # Módulo de autenticación
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── google-auth.service.ts
│   └── auth.module.ts
├── core/                  # Núcleo de la aplicación
│   ├── config/           # Configuraciones globales
│   │   ├── configuration.ts
│   │   ├── validation.ts
│   │   └── axios.configuration.ts
│   ├── database/         # Módulo de base de datos
│   │   ├── database.module.ts
│   │   └── adapters/     # Adaptadores de BD
│   │       ├── firestore/
│   │       └── typeorm/
│   ├── integration/      # Servicios de integración
│   │   ├── axios.service.ts
│   │   └── integration.module.ts
│   └── logger/          # Sistema de logging
│       └── app.logger.ts
├── modules/              # Módulos de negocio
│   ├── users/           # Ejemplo de módulo de dominio
│   ├── confirmations/
│   ├── generics/
│   ├── messages/
│   └── people/
└── shared/              # Recursos compartidos
    ├── constants/       # Constantes globales
    ├── dtos/           # DTOs compartidos
    ├── exceptions/     # Excepciones personalizadas
    ├── guards/         # Guards de autenticación/autorización
    ├── interceptors/   # Interceptores HTTP
    ├── interfaces/     # Interfaces globales
    ├── models/         # Modelos de datos
    ├── pipes/          # Pipes de validación
    ├── services/       # Servicios compartidos
    └── utils/          # Utilidades
```

### **Descripción de Directorios**

#### **Core Module**

- **Config**: Configuraciones globales de la aplicación, axios y validaciones
- **Database**: Implementación de múltiples adaptadores de base de datos
- **Integration**: Servicios para integración con APIs externas
- **Logger**: Sistema de logging personalizado

#### **Shared Module**

Recursos reutilizables en toda la aplicación:

- **Constants**: Valores constantes
- **DTOs**: Objetos de transferencia de datos compartidos
- **Exceptions**: Excepciones personalizadas del dominio
- **Guards**: Protección de rutas (JWT, roles, CSRF)
- **Interceptors**: Interceptores HTTP personalizados
- **Interfaces**: Contratos e interfaces globales
- **Models**: Modelos de datos del dominio
- **Pipes**: Validaciones y transformaciones
- **Services**: Servicios utilitarios compartidos
- **Utils**: Funciones utilitarias

#### **Modules (Módulos de Negocio)**

Cada módulo de negocio sigue esta estructura estándar:

```
modules/
└── [nombre-modulo]/
    ├── [nombre].controller.ts     # Controlador HTTP
    ├── [nombre].service.ts        # Lógica de negocio
    ├── [nombre].module.ts         # Configuración del módulo
    ├── dtos/                      # DTOs específicos del módulo
    │   ├── create-[nombre].dto.ts
    │   ├── update-[nombre].dto.ts
    │   └── response-[nombre].dto.ts
    └── [tests]                    # Archivos de prueba
        ├── [nombre].controller.spec.ts
        └── [nombre].service.spec.ts
```

#### **Auth Module**

Maneja toda la lógica de autenticación y autorización:

- Autenticación JWT
- Integración con Google OAuth
- Generación y validación de tokens

---

## 🗄️ **Adapters de Base de Datos**

El proyecto implementa múltiples adaptadores de base de datos siguiendo el patrón Repository, permitiendo flexibilidad en la elección del sistema de persistencia.

### **Adaptadores Disponibles**

#### **1. Firestore Adapter**

Para aplicaciones que requieren una base de datos NoSQL escalable de Google Cloud.

**Configuración:**

```typescript
// Variables de entorno requeridas
GCP_PROJECT_ID = tu - proyecto - gcp;
GCP_FIRESTORE_DATABASE_ID = tu - database - id;
```

**Uso en módulos:**

```typescript
import { Module } from '@nestjs/common';
import { FirestoreModule } from 'src/core/database/adapters/firestore/firestore.module';

@Module({
  imports: [FirestoreModule],
  providers: [
    // Tus servicios aquí
  ],
})
export class TuModulo {}
```

**Implementación de repositorio:**

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { IFirestoreRepository } from 'src/core/database/adapters/firestore/interfaces/firestore-repository.interface';
import { User } from 'src/shared/models/user.model';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_REPOSITORY')
    private readonly userRepository: IFirestoreRepository<User>,
  ) {}

  async createUser(userData: CreateUserDto): Promise<User> {
    return await this.userRepository.create(userData);
  }
}
```

#### **2. TypeORM Adapter (MySQL)**

Para aplicaciones que requieren una base de datos relacional robusta.

**Configuración:**

```typescript
// Variables de entorno requeridas
DB_HOST = localhost;
DB_PORT = 3306;
DB_USER = usuario;
DB_PASS = contraseña;
DB_DB = nombre_base_datos;
```

**Entidades TypeORM:**

```typescript
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;
}
```

**Uso en servicios:**

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { ITypeOrmRepository } from 'src/core/database/adapters/typeorm/interfaces/typeorm-repository.interface';
import { UserEntity } from 'src/core/database/adapters/typeorm/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @Inject('USER_TYPEORM_REPOSITORY')
    private readonly userRepository: ITypeOrmRepository<UserEntity>,
  ) {}

  async findUserById(id: number): Promise<UserEntity> {
    return await this.userRepository.findById(id);
  }
}
```

### **Unit of Work Pattern**

Ambos adapters implementan el patrón Unit of Work para transacciones:

```typescript
import { Injectable, Inject } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('UOW_FIRESTORE') // o 'UOW_TYPEORM'
    private readonly uow: IUnitOfWork,
  ) {}

  async createUserWithProfile(userData: CreateUserDto): Promise<void> {
    await this.uow.runTransaction(async (transaction) => {
      await this.userRepository.create(userData, transaction);
      await this.profileRepository.create(profileData, transaction);
    });
  }
}
```

---

## 🔌 **Servicio de Integración Axios**

El servicio Axios proporciona una abstracción robusta para comunicación con APIs externas, incluyendo servicios en Cloud Run.

### **Características**

- ✅ Múltiples tipos de autenticación
- ✅ Manejo automático de errores
- ✅ Logging integrado
- ✅ Soporte para Cloud Run authentication
- ✅ Configuración flexible por entorno

### **Tipos de Autenticación Soportados**

#### **1. Sin Autenticación (None)**

```env
EXTERNAL_API_SECURITY_TYPE=none
```

#### **2. API Key**

```env
EXTERNAL_API_SECURITY_TYPE=api-key
EXTERNAL_API_KEY=tu-api-key-secreta
```

#### **3. Bearer Token (JWT)**

```env
EXTERNAL_API_SECURITY_TYPE=bearer-token
EXTERNAL_API_TOKEN=tu-jwt-token
```

#### **4. Google Cloud Run Authentication**

Para comunicación segura entre servicios de Cloud Run:

```env
EXTERNAL_API_SECURITY_TYPE=google-cloud-run-auth
CLOUD_RUN_TARGET_URL=https://tu-servicio-destino.run.app
```

### **Implementación en Servicios**

#### **Configuración del Servicio**

```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosService } from 'src/core/integration/axios.service';
import { SecurityType } from 'src/core/config/axios.configuration';

@Injectable()
export class ExternalApiService {
  private readonly axiosService: AxiosService<any>;

  constructor(private configService: ConfigService) {
    const baseUrl = this.configService.get<string>('externalApiBaseUrl');
    const securityConfig = {
      type: this.configService.get<SecurityType>('externalApiSecurityType'),
      apiKey: this.configService.get<string>('externalApiKey'),
      token: this.configService.get<string>('externalApiToken'),
      cloudRunTargetUrl: this.configService.get<string>('cloudRunTargetUrl'),
    };

    this.axiosService = new AxiosService(baseUrl, securityConfig);
  }

  async onModuleInit() {
    await this.axiosService.onModuleInit();
  }
}
```

#### **Uso en Métodos de Servicio**

```typescript
@Injectable()
export class UserIntegrationService extends ExternalApiService {
  async getUserFromExternalApi(userId: string): Promise<ExternalUser> {
    return await this.axiosService.get(`/users/${userId}`);
  }

  async createExternalUser(userData: CreateUserDto): Promise<ExternalUser> {
    return await this.axiosService.post('/users', userData);
  }

  async updateExternalUser(
    userId: string,
    userData: UpdateUserDto,
  ): Promise<ExternalUser> {
    return await this.axiosService.put(`/users/${userId}`, userData);
  }

  async deleteExternalUser(userId: string): Promise<void> {
    await this.axiosService.delete(`/users/${userId}`);
  }
}
```

### **Comunicación entre Servicios Cloud Run**

Para servicios que necesitan comunicarse entre sí en Google Cloud Run:

#### **Configuración del Servicio Emisor**

```env
# Servicio que hace la llamada
EXTERNAL_API_SECURITY_TYPE=google-cloud-run-auth
EXTERNAL_API_BASE_URL=https://servicio-receptor.run.app
CLOUD_RUN_TARGET_URL=https://servicio-receptor.run.app
```

#### **Configuración del Servicio Receptor**

El servicio receptor debe estar configurado para aceptar tokens de identidad:

```yaml
# cloudbuild.yaml del servicio receptor
- '--allow-unauthenticated' # Si es público
# O configurar IAM apropiado para servicios privados
```

#### **Ejemplo de Comunicación entre Microservicios**

```typescript
@Injectable()
export class OrderService {
  private readonly paymentService: AxiosService<any>;

  constructor(configService: ConfigService) {
    // Configuración para comunicarse con el servicio de pagos
    this.paymentService = new AxiosService('https://payment-service.run.app', {
      type: SecurityType.GOOGLE_CLOUD_RUN_AUTH,
      cloudRunTargetUrl: 'https://payment-service.run.app',
    });
  }

  async processOrder(orderData: CreateOrderDto): Promise<Order> {
    // 1. Crear la orden localmente
    const order = await this.orderRepository.create(orderData);

    // 2. Procesar el pago en otro servicio
    const paymentResult = await this.paymentService.post('/payments', {
      orderId: order.id,
      amount: order.total,
      customerId: order.customerId,
    });

    // 3. Actualizar el estado de la orden
    if (paymentResult.status === 'approved') {
      order.status = 'paid';
      await this.orderRepository.update(order.id, order);
    }

    return order;
  }
}
```

### **Manejo de Errores**

El servicio maneja automáticamente los errores comunes:

```typescript
// Los errores se mapean automáticamente a excepciones personalizadas
try {
  const result = await this.axiosService.get('/endpoint');
} catch (error) {
  // error será una instancia de:
  // - BadRequestException (400)
  // - UnauthorizedAccessException (401)
  // - ResourceNotFoundException (404)
  // - InternalServerErrorException (500)
  // - IntegrationException (otros códigos)
}
```

---

## 📚 **Principios y Buenas Prácticas**

Este proyecto sigue los siguientes principios y buenas prácticas:

### **SOLID Principles**

1. **Single Responsibility Principle**: Cada clase tiene una única responsabilidad
2. **Open/Closed Principle**: Abierto para extensión, cerrado para modificación
3. **Liskov Substitution Principle**: Los adapters son intercambiables
4. **Interface Segregation Principle**: Interfaces específicas y granulares
5. **Dependency Inversion Principle**: Dependencias abstraídas mediante interfaces

### **Arquitectura Hexagonal**

- **Ports**: Interfaces que definen contratos
- **Adapters**: Implementaciones específicas de tecnología
- **Use Cases**: Lógica de negocio pura
- **Domain Models**: Entidades de dominio sin dependencias externas

### **Otras Buenas Prácticas**

- **Manejo Centralizado de Excepciones**: Excepciones personalizadas tipadas
- **Configuración Modular**: Variables de entorno validadas con Joi
- **Logging Estructurado**: Logs consistentes y monitoreables
- **Documentación Automática**: Swagger integrado y obligatorio
- **Testing Comprehensivo**: Pruebas unitarias, de integración y E2E

---

## 🌐 **Variables de Entorno**

| Variable                     | Descripción                                    | Ejemplo                                                    |
| ---------------------------- | ---------------------------------------------- | ---------------------------------------------------------- |
| `APP_PORT`                   | Puerto donde se ejecuta la aplicación          | `3000`                                                     |
| `LIST_CORS`                  | URLs permitidas por CORS (separadas por comas) | `http://localhost:4200,https://app.com`                    |
| `SECRETKEY_AUTH`             | Clave secreta para generar tokens JWT          | `mi-clave-super-secreta-2025`                              |
| `TOKEN_EXPIRATION`           | Duración del token en segundos                 | `3600` (1 hora)                                            |
| `LOG_LEVEL`                  | Nivel de logging                               | `debug`, `info`, `warn`, `error`                           |
| `NODE_ENV`                   | Entorno de ejecución                           | `development`, `production`, `test`                        |
| `GOOGLE_CLIENT_ID`           | ID de cliente de Google OAuth                  | `123456.apps.googleusercontent.com`                        |
| `GCP_PROJECT_ID`             | ID del proyecto de Google Cloud                | `mi-proyecto-gcp`                                          |
| `GCP_FIRESTORE_DATABASE_ID`  | ID de la base de datos Firestore               | `(default)` o `mi-database`                                |
| `DB_HOST`                    | Host de la base de datos MySQL                 | `localhost` o `127.0.0.1`                                  |
| `DB_PORT`                    | Puerto de la base de datos MySQL               | `3306`                                                     |
| `DB_USER`                    | Usuario de la base de datos MySQL              | `usuario`                                                  |
| `DB_PASS`                    | Contraseña de la base de datos MySQL           | `contraseña`                                               |
| `DB_DB`                      | Nombre de la base de datos MySQL               | `mi_base_datos`                                            |
| `EXTERNAL_API_BASE_URL`      | URL base del servicio externo                  | `https://api.ejemplo.com`                                  |
| `EXTERNAL_API_SECURITY_TYPE` | Tipo de seguridad para API externa             | `none`, `api-key`, `bearer-token`, `google-cloud-run-auth` |
| `EXTERNAL_API_KEY`           | Clave API para servicios externos              | `sk_test_123456789`                                        |
| `EXTERNAL_API_TOKEN`         | Token JWT para servicios externos              | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`                  |
| `CLOUD_RUN_TARGET_URL`       | URL del servicio Cloud Run destino             | `https://mi-servicio.run.app`                              |
| `CLOUD_RUN_API_BASE_URL`     | URL base de la API en Cloud Run                | `https://mi-servicio.run.app/api/v1`                       |

---

## ▶️ **Comandos Disponibles**

| Comando                | Descripción                                     |
| ---------------------- | ----------------------------------------------- |
| `npm run build`        | Compila el proyecto para producción             |
| `npm run start`        | Inicia el servidor en modo producción           |
| `npm run start:dev`    | Inicia el servidor en modo desarrollo con watch |
| `npm run start:debug`  | Inicia en modo debug con breakpoints            |
| `npm run start:prod`   | Inicia con la versión compilada                 |
| `npm run lint`         | Ejecuta ESLint para verificar el código         |
| `npm run format`       | Formatea el código con Prettier                 |
| `npm run test`         | Ejecuta pruebas unitarias                       |
| `npm run test:watch`   | Ejecuta pruebas en modo watch                   |
| `npm run test:cov`     | Ejecuta pruebas con reporte de cobertura        |
| `npm run test:debug`   | Ejecuta pruebas en modo debug                   |
| `npm run test:e2e`     | Ejecuta pruebas end-to-end                      |
| `npm run audit:prod`   | Ejecuta auditoría de seguridad de dependencias  |
| `npm run audit:report` | Genera reporte de auditoría de seguridad        |

---

## 🧪 **Testing**

El proyecto implementa una estrategia de testing comprehensiva con **Jest** como framework principal.

### **Configuración de Testing**

#### **Jest Configuration (`jest.config.js`)**

```javascript
module.exports = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.',
  testRegex: '.*\\.spec\\.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest',
  },
  collectCoverage: true,
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.module.ts', // Excluir módulos
    '!src/**/*.dto.ts', // Excluir DTOs
    '!src/**/*.interface.ts', // Excluir interfaces
    '!src/main.ts', // Excluir punto de entrada
    // Más exclusiones específicas...
  ],
  coverageDirectory: './coverage',
  coverageProvider: 'v8',
  coverageReporters: ['text', 'lcov'],
  testEnvironment: 'node',
};
```

### **Tipos de Pruebas**

#### **1. Pruebas Unitarias**

Prueban componentes individuales de forma aislada:

```typescript
// user.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { IUserRepository } from './interfaces/user-repository.interface';

describe('UserService', () => {
  let service: UserService;
  let mockRepository: jest.Mocked<IUserRepository>;

  beforeEach(async () => {
    const mockRepo = {
      create: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: 'USER_REPOSITORY',
          useValue: mockRepo,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    mockRepository = module.get('USER_REPOSITORY');
  });

  it('should create a user successfully', async () => {
    const userData = { name: 'John Doe', email: 'john@example.com' };
    const expectedUser = { id: '1', ...userData };

    mockRepository.create.mockResolvedValue(expectedUser);

    const result = await service.createUser(userData);

    expect(mockRepository.create).toHaveBeenCalledWith(userData);
    expect(result).toEqual(expectedUser);
  });
});
```

#### **2. Pruebas de Integración**

Prueban la interacción entre múltiples componentes:

```typescript
// user.controller.integration.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../app.module';

describe('UserController (Integration)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/users (POST) should create a new user', () => {
    return request(app.getHttpServer())
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'john@example.com',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('John Doe');
      });
  });
});
```

#### **3. Pruebas End-to-End (E2E)**

Prueban flujos completos de la aplicación:

```typescript
// app.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });
});
```

### **Comandos de Testing**

```bash
# Ejecutar todas las pruebas unitarias
npm run test

# Ejecutar pruebas en modo watch
npm run test:watch

# Ejecutar pruebas con cobertura
npm run test:cov

# Ejecutar pruebas E2E
npm run test:e2e

# Ejecutar pruebas en modo debug
npm run test:debug
```

### **Cobertura de Código**

El proyecto está configurado para generar reportes de cobertura:

- **Texto**: Muestra el resumen en consola
- **LCOV**: Genera archivos HTML para visualización detallada
- **Umbral mínimo**: 80% de cobertura recomendado

```bash
# Ver reporte de cobertura en HTML
open coverage/lcov-report/index.html
```

### **Buenas Prácticas de Testing**

1. **AAA Pattern**: Arrange, Act, Assert
2. **Mocking**: Usar mocks para dependencias externas
3. **Test Isolation**: Cada test debe ser independiente
4. **Descriptive Names**: Nombres de tests descriptivos
5. **Edge Cases**: Probar casos límite y errores

---

## 🔍 **SonarQube**

El proyecto incluye integración completa con **SonarQube** para análisis estático de código y métricas de calidad.

### **Configuración de SonarQube**

#### **Archivo `sonar.properties`**

```properties
# Identificación del proyecto
sonar.projectKey=znt-template-project-nest
sonar.projectName=ZNT Template Project NestJS
sonar.projectVersion=2.0.0

# Configuración de fuentes
sonar.sources=src
sonar.tests=src
sonar.test.inclusions=**/*.spec.ts

# Exclusiones de análisis
sonar.exclusions=**/node_modules/**,**/dist/**,**/coverage/**,**/*.spec.ts,**/dtos/**,**/models/**,**/interfaces/**,**/exceptions/**

# Configuración de cobertura
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.typescript.lcov.reportPaths=coverage/lcov.info

# Configuración TypeScript
sonar.typescript.tsconfigPath=tsconfig.json
sonar.sourceEncoding=UTF-8
```

### **Integración con Cloud Build**

El análisis se ejecuta automáticamente en el pipeline de CI/CD:

```yaml
# cloudbuild.yaml
steps:
  - id: 'Sonar'
    name: 'sonarsource/sonar-scanner-cli:5.0'
    entrypoint: 'sonar-scanner'
    args:
      - '-Dsonar.host.url=${_SONAR_URL}'
      - '-Dsonar.token=${_SONAR_TOKEN}'
      - '-Dsonar.projectKey=${_COMPONENT_NAME}'
      - '-Dproject.settings=sonar.properties'
```

### **Métricas Analizadas**

1. **Code Quality**
   - Bugs detectados
   - Vulnerabilidades de seguridad
   - Code smells
   - Duplicación de código

2. **Test Coverage**
   - Cobertura de líneas
   - Cobertura de ramas
   - Cobertura de funciones

3. **Maintainability**
   - Deuda técnica
   - Complejidad ciclomática
   - Tamaño de funciones y clases

4. **Security**
   - Hotspots de seguridad
   - Vulnerabilidades conocidas
   - Análisis de dependencias

### **Umbrale de Calidad**

```javascript
// Configuración recomendada
const qualityGate = {
  coverage: '>= 80%',
  duplicatedLines: '<= 3%',
  maintainabilityRating: 'A',
  reliabilityRating: 'A',
  securityRating: 'A',
};
```

### **Comandos para Análisis Local**

```bash
# Instalar SonarQube Scanner (macOS)
brew install sonar-scanner

# Ejecutar análisis local
sonar-scanner \
  -Dsonar.projectKey=mi-proyecto \
  -Dsonar.sources=src \
  -Dsonar.host.url=http://localhost:9000 \
  -Dsonar.token=mi-token
```

---

## 📄 **Swagger**

El proyecto incluye integración completa con **Swagger** para documentar todos los endpoints de la API. Es **obligatorio** documentar cada endpoint siguiendo las mejores prácticas.

### **Acceso a la Documentación**

Una vez levantado el servidor, la documentación estará disponible en:

```
http://localhost:3000/api/v1/zenta/swagger-doc
```

### **Requisitos de Documentación**

1. **Documentación Obligatoria**: Todos los endpoints deben estar documentados
2. **Ejemplos Realistas**: Incluir ejemplos de request y response
3. **Códigos de Error**: Documentar posibles errores y sus códigos
4. **Seguridad**: Especificar autenticación y autorización requeridas

### **Ejemplo de Documentación Completa**

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiSecurity,
} from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from 'src/shared/models/user.model';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { UsersService } from './users.service';

@ApiTags('Users') // Agrupa endpoints relacionados
@ApiBearerAuth() // Indica autenticación JWT requerida
@ApiSecurity('x-csrf-token') // Indica protección CSRF
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('ADMIN') // Solo admins pueden crear usuarios
  @ApiOperation({
    summary: 'Crear un nuevo usuario',
    description: 'Crea un nuevo usuario en el sistema con validación completa',
  })
  @ApiBody({
    type: CreateUserDto,
    examples: {
      example1: {
        summary: 'Usuario básico',
        value: {
          name: 'Juan Pérez',
          email: 'juan.perez@ejemplo.com',
          role: 'USER',
        },
      },
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: User,
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Juan Pérez',
      email: 'juan.perez@ejemplo.com',
      role: 'USER',
      createdAt: '2025-01-01T00:00:00.000Z',
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Error de validación en los datos enviados',
    example: {
      statusCode: 400,
      message: ['email must be a valid email'],
      error: 'Bad Request',
    },
  })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado - rol insuficiente',
    example: {
      statusCode: 403,
      message: 'Insufficient permissions',
      error: 'Forbidden',
    },
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
```

### **DTOs con Documentación**

```typescript
import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsEnum, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'Nombre completo del usuario',
    example: 'Juan Pérez',
    minLength: 2,
    maxLength: 100,
  })
  @IsNotEmpty()
  @MinLength(2)
  name: string;

  @ApiProperty({
    description: 'Correo electrónico único del usuario',
    example: 'juan.perez@ejemplo.com',
    format: 'email',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    description: 'Rol del usuario en el sistema',
    enum: ['USER', 'ADMIN', 'MODERATOR'],
    example: 'USER',
    default: 'USER',
  })
  @IsEnum(['USER', 'ADMIN', 'MODERATOR'])
  role: string;
}
```

### **Configuración de Swagger**

La configuración se encuentra en `main.ts`:

```typescript
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('ZNT Template Project API')
  .setDescription('API documentation for ZNT Template Project')
  .setVersion('2.0.0')
  .addBearerAuth()
  .addApiKey(
    { type: 'apiKey', name: 'x-csrf-token', in: 'header' },
    'x-csrf-token',
  )
  .build();

const document = SwaggerModule.createDocument(app, config);
SwaggerModule.setup('api/v1/zenta/swagger-doc', app, document);
```

---

## 🐳 **Docker y Cloud Run**

El proyecto está optimizado para despliegue en contenedores Docker y Google Cloud Run.

### **Dockerfile**

```dockerfile
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

FROM node:18-alpine AS development
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=development /app/dist ./dist
COPY package*.json ./

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
```

### **Construcción y Ejecución Local**

```bash
# Construir imagen Docker
docker build -t znt-template-nest .

# Ejecutar contenedor localmente
docker run -p 3000:3000 --env-file .env znt-template-nest

# Ejecutar con variables de entorno específicas
docker run -p 3000:3000 \
  -e APP_PORT=3000 \
  -e NODE_ENV=production \
  znt-template-nest
```

### **Despliegue en Cloud Run**

#### **Pipeline de CI/CD (Cloud Build)**

El archivo `deploy/google/cloudbuild.yaml` automatiza el despliegue:

```yaml
steps:
  # Análisis de código con SonarQube
  - id: 'Sonar'
    name: 'sonarsource/sonar-scanner-cli:5.0'
    entrypoint: 'sonar-scanner'
    args:
      - '-Dsonar.host.url=${_SONAR_URL}'
      - '-Dsonar.token=${_SONAR_TOKEN}'
      - '-Dsonar.projectKey=${_COMPONENT_NAME}'

  # Construcción de imagen Docker
  - id: 'Build docker image'
    name: 'gcr.io/cloud-builders/docker'
    args:
      - 'build'
      - '-t'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/${_DOCKER_REPOSITORY}/${_COMPONENT_NAME}:$BUILD_ID'
      - '.'

  # Push de imagen al Artifact Registry
  - id: 'Push docker image'
    name: 'gcr.io/cloud-builders/docker'
    args:
      - 'push'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/${_DOCKER_REPOSITORY}/${_COMPONENT_NAME}:$BUILD_ID'

  # Despliegue en Cloud Run
  - id: 'Deploy to Cloud Run'
    name: 'gcr.io/cloud-builders/gcloud'
    args:
      - 'run'
      - 'deploy'
      - '${_COMPONENT_NAME}-${_ENV}'
      - '--image'
      - '${_REGION}-docker.pkg.dev/$PROJECT_ID/${_DOCKER_REPOSITORY}/${_COMPONENT_NAME}:$BUILD_ID'
      - '--region'
      - '${_REGION}'
      - '--service-account'
      - '${_RUN_SERVICE_ACCOUNT_EMAIL}'
      - '--platform'
      - 'managed'
      - '--allow-unauthenticated'
      - '--port'
      - '3000'
      - '--timeout'
      - '300'
      - '--cpu'
      - '1'
      - '--memory'
      - '512Mi'
```

#### **Variables de Entorno en Cloud Run**

Las variables se configuran automáticamente en el despliegue:

```bash
ENV=${_ENV}
PROJECT_ID=$PROJECT_ID
LIST_CORS=${_LIST_CORS}
TOKEN_EXPIRATION=${_TOKEN_EXPIRATION}
SECRETKEY_AUTH=${_SECRETKEY_AUTH}
GOOGLE_CLIENT_ID=${_GOOGLE_CLIENT_ID}
GCP_FIRESTORE_DATABASE_ID=${_GCP_FIRESTORE_DATABASE_ID}
NODE_ENV=${_ENV}
LOG_LEVEL=${_LOG_LEVEL}
# ... más variables según necesidad
```

#### **Configuración de IAM para Cloud Run**

```bash
# Crear service account para Cloud Run
gcloud iam service-accounts create cloud-run-service-account

# Asignar roles necesarios
gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:cloud-run-service-account@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/firestore.user"

gcloud projects add-iam-policy-binding PROJECT_ID \
    --member="serviceAccount:cloud-run-service-account@PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/cloudsql.client"
```

### **Optimizaciones para Cloud Run**

1. **Startup Time**: Configurado para arranque rápido
2. **Memory Management**: Optimizado para 512Mi RAM
3. **CPU Allocation**: 1 vCPU para manejo eficiente
4. **Cold Start**: Minimizado con técnicas de warming
5. **Logging**: Integrado con Cloud Logging

---

## 🖥️ **Custom Logger**

Sistema de logging personalizado que proporciona logs estructurados y monitoreables para entornos de producción.

### **Características del Logger**

- ✅ **Formato Estructurado**: JSON para fácil parsing
- ✅ **Levels de Log**: debug, info, warn, error
- ✅ **Context Tracking**: Seguimiento de contexto por request
- ✅ **Cloud Logging Ready**: Compatible con Google Cloud Logging
- ✅ **Performance Optimized**: Mínimo overhead en producción

### **Configuración**

El logger está implementado en `src/core/logger/app.logger.ts`:

```typescript
import { LoggerService } from '@nestjs/common';

export class CustomLogger implements LoggerService {
  log(message: any, context?: string) {
    console.log(
      JSON.stringify({
        level: 'info',
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  error(message: any, trace?: string, context?: string) {
    console.error(
      JSON.stringify({
        level: 'error',
        message,
        trace,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  warn(message: any, context?: string) {
    console.warn(
      JSON.stringify({
        level: 'warn',
        message,
        context,
        timestamp: new Date().toISOString(),
      }),
    );
  }

  debug(message: any, context?: string) {
    if (process.env.LOG_LEVEL === 'debug') {
      console.debug(
        JSON.stringify({
          level: 'debug',
          message,
          context,
          timestamp: new Date().toISOString(),
        }),
      );
    }
  }
}
```

### **Uso en Servicios**

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly logger = new Logger(UserService.name);

  async createUser(userData: CreateUserDto): Promise<User> {
    this.logger.log(`Creating user with email: ${userData.email}`);

    try {
      const user = await this.userRepository.create(userData);
      this.logger.log(`User created successfully with ID: ${user.id}`);
      return user;
    } catch (error) {
      this.logger.error(
        `Failed to create user: ${error.message}`,
        error.stack,
        'createUser',
      );
      throw error;
    }
  }
}
```

### **Configuración de Niveles**

```env
# Desarrollo
LOG_LEVEL=debug

# Producción
LOG_LEVEL=info

# Solo errores críticos
LOG_LEVEL=error
```

### **Monitoreo en Google Cloud**

Los logs se integran automáticamente con Cloud Logging:

```bash
# Ver logs en tiempo real
gcloud logs tail projects/PROJECT_ID/logs/run.googleapis.com%2Fstdout

# Filtrar por nivel de error
gcloud logs read "resource.type=cloud_run_revision AND severity>=ERROR"

# Filtrar por contexto específico
gcloud logs read "resource.type=cloud_run_revision AND jsonPayload.context=UserService"
```

---

## 🛡️ **Validaciones de Seguridad**

Sistema de seguridad multi-capa que protege contra ataques comunes y vulnerabilidades.

### **Componentes de Seguridad**

#### **1. SecurityValidationPipe**

Pipe que valida entradas para detectar patrones maliciosos:

```typescript
import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class SecurityValidationPipe implements PipeTransform {
  private readonly sqlInjectionPatterns = [
    /('|(\\')|(;)|(--)|(\s*(union|select|insert|update|delete|drop|create|alter)\s*)/i,
  ];

  private readonly xssPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
  ];

  transform(value: any): any {
    if (typeof value === 'string') {
      this.validateInput(value);
    } else if (typeof value === 'object' && value !== null) {
      this.validateObject(value);
    }
    return value;
  }

  private validateInput(input: string): void {
    // Validar SQL Injection
    for (const pattern of this.sqlInjectionPatterns) {
      if (pattern.test(input)) {
        throw new BadRequestException('Potential SQL injection detected');
      }
    }

    // Validar XSS
    for (const pattern of this.xssPatterns) {
      if (pattern.test(input)) {
        throw new BadRequestException('Potential XSS attack detected');
      }
    }
  }

  private validateObject(obj: any): void {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        this.validateInput(obj[key]);
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        this.validateObject(obj[key]);
      }
    }
  }
}
```

**Uso:**

```typescript
@Controller('users')
export class UsersController {
  @Post()
  @UsePipes(new SecurityValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    // Los datos están validados contra inyecciones
    return this.usersService.create(createUserDto);
  }
}
```

#### **2. CSRF Interceptor**

Interceptor que valida tokens CSRF para prevenir ataques Cross-Site Request Forgery:

```typescript
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class CsrfInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const method = request.method;

    // Solo validar en métodos que modifican datos
    if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
      const csrfToken = request.headers['x-csrf-token'];

      if (!csrfToken) {
        throw new UnauthorizedException('CSRF token required');
      }

      // Validar token CSRF (implementar lógica según tu estrategia)
      if (!this.validateCsrfToken(csrfToken, request)) {
        throw new UnauthorizedException('Invalid CSRF token');
      }
    }

    return next.handle();
  }

  private validateCsrfToken(token: string, request: any): boolean {
    // Implementar validación de token CSRF
    // Ejemplo: validar contra token almacenado en sesión
    return true; // Placeholder
  }
}
```

**Uso global:**

```typescript
// app.module.ts
import { APP_INTERCEPTOR } from '@nestjs/core';

@Module({
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: CsrfInterceptor,
    },
  ],
})
export class AppModule {}
```

#### **3. Rate Limiting**

Protección contra ataques de fuerza bruta y DDoS:

```typescript
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly requests = new Map();
  private readonly limit = 100; // requests per minute
  private readonly window = 60000; // 1 minute

  use(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip;
    const now = Date.now();

    if (!this.requests.has(ip)) {
      this.requests.set(ip, { count: 1, resetTime: now + this.window });
      return next();
    }

    const userData = this.requests.get(ip);

    if (now > userData.resetTime) {
      userData.count = 1;
      userData.resetTime = now + this.window;
    } else {
      userData.count++;
    }

    if (userData.count > this.limit) {
      return res.status(429).json({
        error: 'Too Many Requests',
        message: 'Rate limit exceeded',
      });
    }

    next();
  }
}
```

### **JWT Security**

```typescript
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateToken(payload: any): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: process.env.SECRETKEY_AUTH,
      expiresIn: process.env.TOKEN_EXPIRATION,
      algorithm: 'HS256', // Algoritmo seguro
    });
  }

  async validateToken(token: string): Promise<any> {
    try {
      return this.jwtService.verifyAsync(token, {
        secret: process.env.SECRETKEY_AUTH,
      });
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }
  }
}
```

### **Configuración de Seguridad en Headers**

```typescript
// main.ts
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de seguridad con helmet
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
        },
      },
      hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
      },
    }),
  );

  await app.listen(3000);
}
```

---

## 🚀 **Distribución y Despliegue**

Estrategia completa de distribución para diferentes entornos y plataformas.

### **Entornos de Despliegue**

#### **1. Desarrollo Local**

```bash
# Configuración para desarrollo
NODE_ENV=development
LOG_LEVEL=debug
APP_PORT=3000

# Comandos
npm run start:dev
```

#### **2. Staging**

```bash
# Configuración para staging
NODE_ENV=staging
LOG_LEVEL=info
APP_PORT=3000

# Despliegue
docker build -t app:staging .
docker run -p 3000:3000 --env-file .env.staging app:staging
```

#### **3. Producción**

```bash
# Configuración para producción
NODE_ENV=production
LOG_LEVEL=warn
APP_PORT=3000

# Despliegue en Cloud Run
gcloud run deploy mi-servicio \
  --image gcr.io/mi-proyecto/mi-app:latest \
  --region us-central1 \
  --allow-unauthenticated
```

### **Pipeline de CI/CD**

#### **Flujo Completo**

```yaml
# .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e

  security:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - run: npm audit --audit-level moderate

  build-and-deploy:
    needs: [test, security]
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: google-github-actions/setup-gcloud@v0
      - run: |
          gcloud builds submit \
            --config cloudbuild.yaml \
            --substitutions _ENV=production
```

### **Estrategias de Despliegue**

#### **Blue-Green Deployment**

```bash
# Desplegar nueva versión
gcloud run deploy mi-servicio-green \
  --image gcr.io/mi-proyecto/mi-app:v2.0.0

# Cambiar tráfico gradualmente
gcloud run services update-traffic mi-servicio \
  --to-revisions=mi-servicio-green=100

# Eliminar versión anterior
gcloud run revisions delete mi-servicio-blue
```

#### **Canary Deployment**

```bash
# Desplegar canary con 10% de tráfico
gcloud run services update-traffic mi-servicio \
  --to-revisions=mi-servicio-canary=10,mi-servicio-stable=90

# Si todo va bien, cambiar a 100%
gcloud run services update-traffic mi-servicio \
  --to-revisions=mi-servicio-canary=100
```

### **Monitoreo y Observabilidad**

#### **Health Checks**

```typescript
import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class HealthController {
  @Get()
  @ApiOperation({ summary: 'Health check endpoint' })
  check() {
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV,
    };
  }

  @Get('ready')
  @ApiOperation({ summary: 'Readiness check' })
  async ready() {
    // Verificar conexiones a BD, APIs externas, etc.
    return { status: 'ready' };
  }

  @Get('live')
  @ApiOperation({ summary: 'Liveness check' })
  live() {
    return { status: 'alive' };
  }
}
```

#### **Métricas de Performance**

```typescript
import { Injectable, OnModuleInit } from '@nestjs/common';
import { createPrometheusMetrics } from 'prometheus';

@Injectable()
export class MetricsService implements OnModuleInit {
  private requestCounter;
  private responseTimeHistogram;

  onModuleInit() {
    this.requestCounter = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status'],
    });

    this.responseTimeHistogram = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'HTTP request duration in seconds',
      labelNames: ['method', 'route'],
    });
  }
}
```

### **Backup y Disaster Recovery**

#### **Backup de Base de Datos**

```bash
# Firestore export
gcloud firestore export gs://mi-bucket/backup-$(date +%Y%m%d)

# MySQL backup
mysqldump -u user -p database > backup-$(date +%Y%m%d).sql
```

#### **Plan de Recuperación**

1. **RTO (Recovery Time Objective)**: 15 minutos
2. **RPO (Recovery Point Objective)**: 1 hora
3. **Procedimiento de rollback automático**
4. **Monitoreo de salud de servicios**

---

## 🤝 **Contribuciones**

### **Guía de Contribución**

1. **Fork** del repositorio
2. **Crear rama** feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Implementar** siguiendo las convenciones del proyecto
4. **Pruebas** unitarias y de integración
5. **Documentar** cambios en Swagger
6. **Commit** con mensajes descriptivos
7. **Pull Request** con descripción detallada

### **Estándares de Código**

```bash
# Antes de hacer commit
npm run lint          # Verificar estilo de código
npm run test          # Ejecutar pruebas
npm run test:cov      # Verificar cobertura
npm run audit:prod    # Verificar seguridad
```

### **Convenciones de Commit**

```bash
# Formato: tipo(alcance): descripción
feat(users): add user creation endpoint
fix(auth): resolve JWT token validation
docs(readme): update installation guide
test(users): add unit tests for user service
refactor(core): optimize database connection
```

---

## 📚 **Recursos Adicionales**

### **Documentación Técnica**

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Google Cloud Run Documentation](https://cloud.google.com/run/docs)
- [Jest Testing Framework](https://jestjs.io/docs/getting-started)

### **Ejemplos y Templates**

- [Nest Tools Template](https://github.com/Zenta-Group/nest-tools-template/tree/main)
- [Arquitectura Hexagonal Examples](https://github.com/Zenta-Group/hexagonal-architecture-examples)

### **Herramientas Recomendadas**

- **IDE**: Visual Studio Code con extensiones NestJS
- **API Testing**: Postman o Insomnia
- **Database Management**: DBeaver (MySQL), Firebase Console (Firestore)
- **Monitoring**: Google Cloud Monitoring, Datadog
- **Performance**: Artillery, k6 para load testing

### **Comunidad y Soporte**

- **Issues**: Reportar bugs en GitHub Issues
- **Discussions**: Discusiones técnicas en GitHub Discussions
- **Slack**: Canal #backend-nestjs en Zenta Slack
- **Code Reviews**: Proceso obligatorio para todos los PRs

---

**¡Feliz desarrollo con ZNT Template Project! 🚀**
