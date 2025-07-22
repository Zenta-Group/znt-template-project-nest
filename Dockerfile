# ------------------------
# Etapa 1: Build
# ------------------------
FROM node:24.1.0-slim AS builder

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar archivos de dependencias primero (para aprovechar caché)
COPY package*.json ./

# Instalar TODAS las dependencias (incluyendo dev) para build
RUN npm ci

# Copiar el código fuente
COPY src ./src
COPY nest-cli.json ./
COPY tsconfig*.json ./

# Compilar el proyecto (NestJS genera carpeta /dist)
RUN npm run build

# Instalar solo dependencias de producción
RUN npm prune --omit=dev

# ------------------------
# Etapa 2: Producción
# ------------------------
FROM node:24.1.0-slim

# Crear un usuario no root para ejecutar la app
RUN groupadd -r appgroup && useradd -m -r -g appgroup appuser

WORKDIR /usr/src/app

# Copiar solo archivos necesarios desde el builder
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/dist ./dist

# Reducir tamaño: borrar caché de npm
RUN npm cache clean --force

# Exponer puerto (NestJS por defecto en 3000)
EXPOSE 3000

# Cambiar al usuario no root
USER appuser

# Comando de inicio
CMD [ "node", "dist/main.js" ]


