# 🏢 Sistema de Gestión de RRHH

Una aplicación Fullstack, segura y con diseño responsive para Recursos Humanos, diseñada con un enfoque en el minimalismo y el alto rendimiento en la gestión de datos.

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)

## ✨ Características Principales

- 🔐 **Autenticación JWT:** Acceso seguro al portal con rutas de API protegidas.
- 📂 **Operaciones CRUD Completas:** Administra registros de empleados (Crear, Leer, Actualizar, Eliminar) con facilidad.
- 🔍 **Búsqueda en Tiempo Real:** Filtra las entradas del directorio por nombre de forma instantánea.
- ⚡ **Integración con Supabase:** Base de datos PostgreSQL de alta disponibilidad.

## 🛠️ Arquitectura

El sistema sigue el patrón **MVC (Modelo-Vista-Controlador)** para una clara separación de responsabilidades:

- **Frontend:** HTML5, JavaScript Vanilla y Tailwind CSS (CDN).
- **Backend:** Node.js con Express.js.
- **Seguridad:** Bcrypt para la verificación de contraseñas y JSON Web Tokens para el estado de la sesión.
- **Almacenamiento:** Supabase PostgreSQL con `@supabase/supabase-js`.

## 🚀 Comenzando

### 1. Requisitos
- Node.js (v18+)
- Un proyecto en Supabase

### 2. Instalación
```bash
git clone <url-de-tu-repositorio>
cd RH-ExpressJS
npm install
```

### 3. Configuración del Entorno
Crea un archivo `.env` en el directorio raíz:
```env
PORT=3000
SUPABASE_URL=tu_url_de_proyecto_supabase
SUPABASE_ANON_KEY=tu_anon_key_de_supabase
JWT_SECRET=tu_cadena_secreta_aleatoria
```

### 4. Configuración de la Base de Datos
Ejecuta el siguiente SQL en tu Editor SQL de Supabase:
```sql
CREATE TABLE users (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  username text UNIQUE NOT NULL,
  password text NOT NULL
);

CREATE TABLE employees (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre text NOT NULL,
  apellidos text NOT NULL,
  telefono text,
  correo text UNIQUE NOT NULL,
  direccion text
);

-- Usuario administrador por defecto (Login: admin / 123456)
INSERT INTO users (username, password) VALUES ('admin', '123456');
```

### 5. Lanzamiento
```bash
npm run dev
```


---
