# Tennis Star - Backend API

Backend RESTful API para el sistema de gestión de ventas Tennis Star. Desarrollado con NestJS, Prisma ORM y PostgreSQL, proporciona funcionalidades completas para manejo de productos con variantes, categorías jerárquicas, ventas, clientes y autenticación basada en JWT.

---

## 📋 Descripción del Sistema

Este backend es responsable de:

- **Gestión de productos complejos**: Productos configurables con múltiples opciones (talla, color, etc.) que generan variantes automáticamente con SKUs y precios independientes
- **Categorización jerárquica**: Sistema de categorías con relaciones padre-hijo ilimitadas
- **Procesamiento de ventas**: Gestión completa del ciclo de vida de órdenes con historial de estados y tracking
- **Administración de clientes**: CRUD de clientes con relación a sus compras
- **Autenticación y sesiones**: Sistema de login con JWT, cookies httpOnly y soporte para "recordarme"
- **Gestión de imágenes**: Integración con Cloudinary para almacenamiento y optimización de imágenes
- **Analytics**: Dashboard con métricas de ventas recientes, productos más vendidos y totales

---

## 🛠 Stack Tecnológico

### Core Framework

- **NestJS v11.0.1**: Framework Node.js progresivo con arquitectura modular y TypeScript
- **TypeScript v5.9.3**: Tipado estático para mayor seguridad y mantenibilidad

### Base de Datos

- **PostgreSQL**: Base de datos relacional
- **Prisma ORM v7.3.0**: ORM moderno con generación de tipos TypeScript automática
- **@prisma/adapter-pg**: Adaptador de PostgreSQL con pool de conexiones nativo

### Autenticación y Seguridad

- **@nestjs/jwt v11.0.2**: Generación y validación de tokens JWT
- **bcrypt v6.0.0**: Hash de contraseñas con salt rounds

### Validación

- **class-validator v0.14.3**: Validación declarativa mediante decoradores
- **class-transformer v0.5.1**: Transformación y serialización de DTOs

### Almacenamiento de Archivos

- **cloudinary v2.9.0**: Gestión de imágenes (upload, transformación, CDN)
- **buffer-to-stream v1.0.0**: Conversión de buffers de Multer a streams para Cloudinary

### Otros

- **dotenv v17.2.3**: Gestión de variables de entorno
- **@nestjs/platform-express v11.0.1**: Capa HTTP con soporte para multipart/form-data

---

## 🏗 Arquitectura y Estructura de Carpetas

El proyecto sigue la arquitectura modular de NestJS con separación clara de responsabilidades:

```
backend/
├── prisma/
│   ├── schema.prisma          # Definición del modelo de datos
│   └── migrations/            # Historial de migraciones de DB
├── src/
│   ├── main.ts                # Entry point - Bootstrap de la app
│   ├── app.module.ts          # Módulo raíz que importa todos los módulos
│   │
│   ├── auth/                  # Módulo de autenticación
│   │   ├── auth.controller.ts # Endpoints: /auth/login, /auth/sign-out
│   │   ├── auth.service.ts    # Lógica de autenticación con bcrypt y JWT
│   │   └── dto/
│   │       └── login-user-dto.ts
│   │
│   ├── categories/             # Módulo de categorías
│   │   ├── categories.controller.ts
│   │   ├── categories.service.ts    # CRUD con relaciones recursivas
│   │   └── dto/
│   │
│   ├── products/               # Módulo de productos
│   │   ├── products.controller.ts   # CRUD + endpoints para variantes
│   │   ├── products.service.ts      # Lógica de generación de variantes
│   │   └── dto/
│   │       ├── create-product-dto.ts
│   │       ├── update-product-dto.ts
│   │       ├── preview-variants-dto.ts
│   │       └── update-variant-dto.ts
│   │
│   ├── sales/                  # Módulo de ventas
│   │   ├── sales.controller.ts
│   │   ├── sales.service.ts    # Generación de order numbers, cálculo automático de totales
│   │   └── dto/
│   │       ├── create-sales-dto.ts
│   │       └── update-status-dto.ts
│   │
│   ├── clients/                # Módulo de clientes
│   │   ├── clients.controller.ts
│   │   └── clients.service.ts
│   │
│   ├── cloudinary/             # Módulo de gestión de imágenes
│   │   ├── cloudinary.module.ts
│   │   └── cloudinary.service.ts    # Upload de imágenes a Cloudinary
│   │
│   ├── dashboard-home/         # Módulo de analytics
│   │   ├── dashboard-home.controller.ts
│   │   └── dashboard-home.service.ts # Agregación de métricas
│   │
│   ├── user/                   # Módulo de usuarios
│   │   └── user.service.ts
│   │
│   └── prisma/                 # Módulo de Prisma
│       ├── prisma.module.ts
│       └── prisma.service.ts   # Cliente de Prisma con lifecycle hooks
│
└── generated/prisma/           # Cliente de Prisma generado (no editar)
```

---

## 🔄 Flujo de Datos

### Patrón General: Controller → Service → Prisma

```
HTTP Request
    ↓
Controller (validación de DTOs con class-validator)
    ↓
Service (lógica de negocio)
    ↓
Prisma Service (queries a PostgreSQL)
    ↓
PostgreSQL Database
```

### Ejemplo: Creación de Producto

1. **Controller** (`products.controller.ts`):
   - Recibe `POST /products/create` con multipart/form-data
   - Usa `FilesInterceptor` para procesar archivos de imágenes
   - Parsea campos JSON (`options`, `variants`)
   - Valida DTO con decoradores de `class-validator`

2. **Service** (`products.service.ts`):
   - Valida unicidad del nombre del producto
   - **Genera combinaciones de variantes** desde opciones (algoritmo cartesiano)
   - Valida SKUs (únicos o por variante según `skuType`)
   - Sube imágenes a Cloudinary con folder dinámico basado en slug
   - Crea producto, opciones, variantes y relación con categoría en **transacción implícita de Prisma**

3. **Prisma Service**:
   - Ejecuta `prisma.product.create()` con `include` para opciones y variantes
   - Retorna objeto completo con relaciones cargadas

### Ejemplo: Actualización de Estado de Venta

1. **Controller** recibe `PATCH /sales/status` con `{ saleId, status, userId, note }`
2. **Service** usa `prisma.$transaction()` explícita para:
   - Actualizar el estado de la venta
   - Crear registro en historial (`SaleHistory`)
3. Garantiza atomicidad: ambas operaciones ocurren o ninguna

---

## 💾 Manejo de Base de Datos y Migraciones

### Configuración de Prisma

El esquema define:

- **11 modelos**: User, Category, Brand, Product, ProductOption, ProductVariant, Client, Sale, SaleItem, SaleHistory
- **Enums**: ProductStatus, SaleStatus, PaymentMethod, PaymentStatus
- **Relaciones complejas**:
  - Categorías auto-referenciales (recursivas)
  - Productos → Opciones → Variantes (one-to-many cascading)
  - Ventas → Items → Variantes (con soft delete en variantes)
  - Ventas → Historial con auditoría de usuarios

### Tipos de Datos Especiales

- `Decimal(10, 2)`: Para precios y totales (evita problemas de redondeo)
- `Json`: Campo `attributes` en variantes (almacena `{ "Color": "Azul", "Talla": "42" }`)
- `String[]`: Arrays de strings para imágenes y valores de opciones
- `DateTime`: Con `@default(now())` y `@updatedAt` para timestamps automáticos

### Flujo de Migraciones

```bash
# Crear migración después de cambios en schema.prisma
npx prisma migrate dev --name nombre_descriptivo

# Aplicar migraciones en producción
npx prisma migrate deploy

# Generar cliente TypeScript actualizado
npx prisma generate
```

**Nota**: El cliente se genera en `generated/prisma/` (customizado en schema.prisma)

### Prisma Client Lifecycle

`PrismaService` implementa `OnModuleInit` y `OnModuleDestroy`:

- **Conexión automática** al iniciar la app con pool de PostgreSQL
- **Desconexión limpia** al cerrar la aplicación
- Logs detallados de estado de conexión

---

## ✅ Validaciones, DTOs y Manejo de Errores

### Validación con class-validator

Todos los DTOs usan decoradores para validación automática gracias a `ValidationPipe` global:

```typescript
// LoginUserDto
export class LoginUserDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;

  @IsBoolean()
  rememberMe!: boolean;
}
```

El `ValidationPipe` global en `main.ts` intercepta requests y lanza excepciones automáticas si la validación falla.

### DTOs Principales

- **Auth**: `LoginUserDto`
- **Products**: `CreateProductDto`, `UpdateProductDto`, `UpdateVariantDto`, `PreviewVariantsDto`
- **Categories**: `CreateCategoryDto`
- **Sales**: `CreateSalesDto`, `UpdateStatusDto`

### Manejo de Errores

El proyecto usa las excepciones built-in de NestJS:

1. **ConflictException (409)**:
   - Nombre de producto duplicado
   - Posición de categoría duplicada
   - SKU duplicado (errores de Prisma `P2002`)

2. **NotFoundException (404)**:
   - Producto/categoría no encontrada (errores de Prisma `P2025`)

3. **BadRequestException (400)**:
   - Credenciales inválidas
   - Variantes no coinciden con opciones de producto
   - SKUs inválidos según tipo configurado

**Ejemplo en products.service.ts**:

```typescript
if (existingName) {
  throw new ConflictException(
    `Product with name "${product.name}" already exists`,
  );
}
```

NestJS automáticamente convierte estas excepciones en respuestas HTTP con formato estándar:

```json
{
  "statusCode": 409,
  "message": "Product with name \"...\" already exists",
  "error": "Conflict"
}
```

---

## 🔐 Autenticación y Autorización

### Mecanismo de Autenticación

El sistema usa **JWT** con almacenamiento en **cookies httpOnly** para mitigar ataques XSS:

1. **Login** (`POST /auth/login`):
   - Valida email y contraseña contra base de datos
   - Compara hash con `bcrypt.compare()`
   - Genera token JWT con payload: `{ sub, id, email }`
   - Configura expiración dinámica:
     - `rememberMe: true` → 30 días
     - `rememberMe: false` → 2 horas
   - Establece dos cookies:
     - `session`: Token JWT (httpOnly, sameSite: lax)
     - `session_id`: ID del usuario (para uso en frontend)

2. **Sign Out** (`POST /auth/sign-out`):
   - Limpia ambas cookies con `res.clearCookie()`
   - Importante: usa mismo `path` y `sameSite` que al establecer

### Configuración de JWT

```typescript
// En auth.module.ts
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: '2h' }, // Sobrescrito dinámicamente
});
```

### Limitación Actual

**No hay guards implementados**. El sistema genera y valida tokens, pero no protege rutas. Para implementar protección:

1. Crear `JwtAuthGuard` extendiendo `AuthGuard('jwt')`
2. Crear `JwtStrategy` que extraiga el token de las cookies
3. Aplicar `@UseGuards(JwtAuthGuard)` en controllers

---

## 🌍 Variables de Entorno Requeridas

Crear archivo `.env` en la raíz del proyecto:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE_NAME?schema=public"

# Puerto del servidor
PORT=8000

# Secret para firmar JWT (cambiar en producción)
JWT_SECRET=mi_secreto_jwt

# Credenciales de Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

### Notas de Seguridad

- En producción, usar secrets seguros y rotar `JWT_SECRET`
- No commitear `.env` (incluido en `.gitignore`)
- Las cookies cambian `secure: true` automáticamente en `NODE_ENV=production`

---

## 🚀 Instalación y Ejecución Local

### Prerrequisitos

- **Node.js** ≥ 18
- **PostgreSQL** ≥ 14
- **npm** o **pnpm**

### Pasos de Instalación

1. **Clonar el repositorio**

```bash
cd backend
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar variables de entorno**

Crear archivo `.env` con las variables listadas en la sección anterior.

4. **Configurar base de datos**

Crear base de datos PostgreSQL:

```sql
CREATE DATABASE tennis_star_db;
```

5. **Ejecutar migraciones de Prisma**

```bash
npx prisma migrate dev
```

Esto aplicará todas las migraciones y generará el cliente Prisma.

6. **Generar cliente Prisma** (si es necesario)

```bash
npx prisma generate
```

7. **Iniciar el servidor en modo desarrollo**

```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:8000`.

### Scripts Disponibles

```bash
npm run start        # Iniciar en modo producción
npm run start:dev    # Modo desarrollo con hot-reload
npm run build        # Compilar TypeScript a dist/
npm run format       # Formatear código con Prettier
npm run lint         # Ejecutar ESLint con auto-fix
```

### Verificar Instalación

Probar endpoint de salud:

```bash
curl http://localhost:8000
```

## 📝 Notas Adicionales

### Estado del Proyecto

- ✅ **CRUD completo** para productos, categorías, ventas, clientes
- ✅ **Autenticación funcional** con JWT y cookies
- ⚠️ **Sin guards de autorización** (rutas no protegidas actualmente)
- ⚠️ **Sin tests** (estructura lista para Jest, pero no implementados)
- ✅ **Validaciones robustas** en servicios y DTOs

---

**Última actualización**: Febrero 2026
