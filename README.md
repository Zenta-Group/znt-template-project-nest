# **ZNT Template Project - NestJS**

Este es un proyecto base construido con **NestJS** que sigue los principios de **Arquitectura Hexagonal**, **SOLID** y **buenas prácticas de desarrollo**. Está diseñado para ser utilizado como plantilla para nuevos proyectos, permitiendo una rápida configuración y escalabilidad.

## 📋 **Tabla de Contenidos**

1. [Requisitos Previos](#requisitos-previos)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Estructura del Proyecto](#estructura-del-proyecto)
4. [Principios y Buenas Prácticas](#principios-y-buenas-prácticas)
5. [Variables de Entorno](#variables-de-entorno)
6. [Comandos Disponibles](#comandos-disponibles)
7. [Swagger](#swagger)
8. [Docker](#docker)
9. [Custom Logger](#custom-logger)
10. [Validaciones de Seguridad](#validaciones-de-seguridad)
11. [Contribuciones](#contribuciones)
12. [Recursos Adicionales](#recursos-adicionales)

---

## 🛠️ **Requisitos Previos**

Antes de comenzar, asegúrate de tener instalado lo siguiente en tu entorno de desarrollo:

- **Node.js** (v20.x o superior)
- **npm** o **yarn**
- **Docker** (opcional, si deseas ejecutar el proyecto en contenedores)
- **Google Cloud SDK** (opcional, si usas Firestore)
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

### 3. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto y configura las siguientes variables:

```env
APP_PORT=3000
LIST_CORS=http://localhost:4200,http://localhost:3000
SECRETKEY_AUTH=tu-clave-secreta
TOKEN_EXPIRATION=3600
GOOGLE_CLIENT_ID=tu-client-id-google # Opcional
GCP_PROJECT_ID=tu-proyecto-gcp # Opcional
GCP_FIRESTORE_DATABASE_ID=tu-base-de-datos-firestore # Opcional
EXTERNAL_API_BASE_URL=https://api.ejemplo.com
EXTERNAL_API_SECURITY_TYPE=api-key # none | api-key | bearer-token
EXTERNAL_API_KEY=tu-api-key # Si aplica
EXTERNAL_API_TOKEN=tu-token-jwt # Si aplica
```

### 4. Ejecutar el Proyecto

Para iniciar el proyecto en modo desarrollo:

```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`.

---

## 📂 **Estructura del Proyecto**

La estructura del proyecto está organizada siguiendo los principios de modularidad y separación de responsabilidades. A continuación, se describe cada directorio:

¡Entendido! Vamos a corregir la sección **"Estructura del Proyecto"** para reflejar correctamente la descripción de los módulos de negocio/dominio, como el módulo `Users`. Aquí está la actualización:

---

## 📂 **Estructura del Proyecto**

La estructura del proyecto está organizada siguiendo los principios de modularidad y separación de responsabilidades. A continuación, se describe cada directorio:

### **Core Module**

- **Config**: Archivos de configuración global (`axios.configuration.ts`, `configuration.ts`).
- **Database**: Implementación de bases de datos (ejemplo: Firestore).
- **Integration**: Servicios de integración externa (ejemplo: Axios).
- **Logger**: Manejo centralizado de logs.

### **Shared Module**

- **Constants**: Constantes globales.
- **DTOs**: Definiciones de objetos de transferencia de datos.
- **Entities**: Modelos de datos.
- **Exceptions**: Excepciones personalizadas.
- **Guards**: Protección de rutas (JWT, roles).
- **Interceptors**: Interceptores HTTP.
- **Interfaces**: Interfaces genéricas.
- **Pipes**: Validaciones personalizadas.
- **Utils**: Funciones utilitarias.

### **Modules**

Sección donde irán los distintos módulos que hacen relación con el negocio/dominio del proyecto. Un ejemplo de esto es el módulo **Users**, que sigue la siguiente estructura:

- **Controllers**: Controladores para manejar solicitudes HTTP.
- **Services**: Lógica de negocio.
- **DTOs**: DTOs específicos del módulo.
- **Repositories**: Implementación de repositorios para interactuar con bases de datos.
- **Entities**: Entidades específicas del módulo.

Cada nuevo módulo debe seguir esta misma estructura para mantener consistencia en el proyecto.

### **Auth Module**

- **Autenticación y Autorización**: Implementación de JWT, Google Auth, etc.

---

## 📚 **Principios y Buenas Prácticas**

Este proyecto sigue los siguientes principios y buenas prácticas:

1. **SOLID**:

   - Separación clara de responsabilidades entre capas (controladores, servicios, repositorios).
   - Uso de interfaces para abstraer dependencias.

2. **Arquitectura Hexagonal**:

   - Implementación del patrón Repository para interactuar con bases de datos.
   - Servicios de integración externa desacoplados.

3. **Manejo Centralizado de Excepciones**:

   - Excepciones personalizadas para errores comunes.

4. **Configuración Modular**:

   - Uso de `@nestjs/config` para gestionar variables de entorno.

5. **Documentación con Swagger**:
   - Documentación completa de endpoints con ejemplos y respuestas.

---

## 🌐 **Variables de Entorno**

| Variable                     | Descripción                                            |
| ---------------------------- | ------------------------------------------------------ |
| `APP_PORT`                   | Puerto donde se ejecuta la aplicación.                 |
| `LIST_CORS`                  | Lista de URLs permitidas por CORS.                     |
| `SECRETKEY_AUTH`             | Clave secreta para generar tokens JWT.                 |
| `TOKEN_EXPIRATION`           | Duración del token en segundos.                        |
| `GOOGLE_CLIENT_ID`           | ID de cliente de Google (opcional).                    |
| `GCP_PROJECT_ID`             | ID del proyecto de Google Cloud (opcional).            |
| `GCP_FIRESTORE_DATABASE_ID`  | ID de la base de datos Firestore (opcional).           |
| `EXTERNAL_API_BASE_URL`      | URL base del servicio externo.                         |
| `EXTERNAL_API_SECURITY_TYPE` | Tipo de seguridad (`none`, `api-key`, `bearer-token`). |
| `EXTERNAL_API_KEY`           | Clave API (si aplica).                                 |
| `EXTERNAL_API_TOKEN`         | Token JWT (si aplica).                                 |

---

## ▶️ **Comandos Disponibles**

| Comando             | Descripción                              |
| ------------------- | ---------------------------------------- |
| `npm run build`     | Compila el proyecto.                     |
| `npm run start`     | Inicia el servidor en modo producción.   |
| `npm run start:dev` | Inicia el servidor en modo desarrollo.   |
| `npm run lint`      | Ejecuta ESLint para verificar el código. |
| `npm run test`      | Ejecuta pruebas unitarias.               |
| `npm run test:e2e`  | Ejecuta pruebas end-to-end.              |

---

## 📄 **Swagger**

El proyecto incluye integración completa con **Swagger** para documentar todos los endpoints de la API. Es **obligatorio** documentar cada endpoint siguiendo las mejores prácticas de Swagger. Esto garantiza que la API sea fácil de entender y consumir por otros desarrolladores.

### **Requisitos de Documentación**

1. **Todos los endpoints deben estar documentados**: Cada controlador, método y parámetro debe tener una descripción clara.
2. **Incluir ejemplos de solicitud y respuesta**: Proporciona ejemplos realistas para facilitar las pruebas.
3. **Especificar roles y permisos**: Indica qué roles tienen acceso a cada endpoint.
4. **Manejo de errores**: Documenta los posibles códigos de error y sus significados.

### **Ejemplo de Documentación con Swagger**

Aquí tienes un ejemplo de cómo debe documentarse un endpoint utilizando Swagger:

```typescript
import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiBody,
} from '@nestjs/swagger';
import { CreateUserDto } from './dtos/create-users.dto';
import { User } from 'src/shared/entities/user.entity';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { Roles } from 'src/shared/guards/roles.decorator';
import { UsersService } from './users.service';
@ApiTags('Users') // Etiqueta para agrupar endpoints relacionados
@ApiBearerAuth() // Indica que este endpoint requiere autenticación JWT
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard) // Protege el endpoint con guards
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  @Roles('ADMIN') // Solo accesible para usuarios con rol ADMIN
  @ApiOperation({ summary: 'Crear un nuevo usuario' }) // Descripción del endpoint
  @ApiBody({ type: CreateUserDto }) // Define el DTO de entrada
  @ApiResponse({
    status: 201,
    description: 'Usuario creado exitosamente',
    type: User, // Define el tipo de respuesta
  })
  @ApiResponse({ status: 400, description: 'Error de validación en DTO' })
  @ApiResponse({
    status: 403,
    description: 'Acceso denegado (rol no permitido)',
  })
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.createUser(createUserDto);
  }
}
```

### **Cómo Acceder a la Documentación**

1. Levanta el servidor en modo desarrollo:

   ```bash
   npm run start:dev
   ```

2. Abre tu navegador y navega a:

   ```
   http://localhost:3000/api
   ```

3. La interfaz de Swagger mostrará todos los endpoints documentados, junto con ejemplos de solicitudes y respuestas.

### **Consejos Adicionales**

- Usa `@ApiTags` para agrupar endpoints relacionados (por ejemplo, "Users", "Auth").
- Usa `@ApiParam` para documentar parámetros de ruta (ejemplo: `/users/:id`).
- Usa `@ApiQuery` para documentar parámetros de consulta (ejemplo: `?page=1&limit=10`).
- Si un endpoint maneja archivos, usa `@ApiConsumes` y `@ApiBody` para especificar el formato.

---

## 🐳 **Docker**

El proyecto incluye un `Dockerfile` para facilitar su ejecución en contenedores. Para construir y ejecutar el contenedor:

```bash
docker build -t znt-template .
docker run -p 3000:3000 znt-template
```

---

## 🖥️ **Custom Logger**

Se ha implementado un **Custom Logger** para estandarizar el formato de los logs en toda la aplicación. Este logger reemplaza el sistema de registro predeterminado de NestJS y proporciona un formato limpio y consistente.

### **Características**

- Logs sin colores ni tiempos redundantes.
- Compatible con sistemas de monitoreo como GCP, AWS CloudWatch, etc.
- Fácil lectura en consolas de producción.

### **Implementación**

El Custom Logger está implementado en:

```
src/core/logger/custom-logger.ts
```

### **Uso**

Todos los logs generados por NestJS y los que escribas manualmente en tu aplicación usarán este logger. Ejemplo:

```typescript
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  constructor() {}

  getHello(): string {
    this.logger.log('Método getHello llamado');
    return 'Hello World!';
  }
}
```

---

## 🛡️ **Validaciones de Seguridad**

El proyecto incluye mecanismos avanzados de validación para prevenir ataques comunes como inyecciones SQL, XSS y CSRF.

### **1. SecurityValidationPipe**

Este pipe valida entradas para detectar patrones maliciosos relacionados con inyecciones SQL y XSS. Se utiliza en controladores para proteger endpoints sensibles.

#### **Implementación**

El pipe está implementado en:

```
src/shared/pipes/validations/security-validation.pipe.ts
```

#### **Uso**

```typescript
import { UsePipes } from '@nestjs/common';
import { SecurityValidationPipe } from 'src/shared/pipes/validations/security-validation.pipe';

@Controller('users')
export class UsersController {
  @Post()
  @UsePipes(new SecurityValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    // Procesar datos seguros
    return { message: 'Usuario creado correctamente' };
  }
}
```

### **2. Interceptor CSRF**

Este interceptor valida el token CSRF en cada solicitud HTTP para prevenir ataques CSRF. Se integra automáticamente en la aplicación.

#### **Implementación**

El interceptor está implementado en:

```
src/shared/interceptors/csrf.interceptor.ts
```

#### **Uso**

El interceptor se aplica globalmente o en controladores específicos:

```typescript
import { UseInterceptors } from '@nestjs/common';
import { CsrfInterceptor } from 'src/shared/interceptors/csrf.interceptor';

@Controller('users')
@UseInterceptors(CsrfInterceptor)
export class UsersController {
  @Post()
  protectedEndpoint() {
    return { message: 'Acceso permitido.' };
  }
}
```

---

## 🤝 **Contribuciones**

Si deseas contribuir al proyecto, sigue estos pasos:

1. Haz un fork del repositorio.
2. Crea una nueva rama (`git checkout -b feature/nueva-funcionalidad`).
3. Realiza tus cambios y haz commit (`git commit -m "Añadir nueva funcionalidad"`).
4. Sube los cambios (`git push origin feature/nueva-funcionalidad`).
5. Abre un Pull Request.

---

## 📚 **Recursos Adicionales**

Para más ejemplos de herramientas ya implementadas, visita [este enlace](https://github.com/Zenta-Group/nest-tools-template/tree/main).
