# Chatbot Istmania - Frontend

Aplicacion Angular independiente para iniciar sesion, administrar usuarios y roles, y utilizar el chat.
Backend: https://github.com/yovanniistmania/Chatbotbackend

## Desarrollo

Requiere Node.js 20 o 22 LTS y npm. Ejecutar desde la raiz de este repositorio:

```powershell
npm ci
npm start
```

Abrir `http://localhost:4200`. Iniciar tambien el backend, cuya URL predeterminada es `http://localhost:3020`.

## Conexion con el backend

Configurar `apiUrl` en:

- `src/environments/environment.ts` para desarrollo.
- `src/environments/environment.prod.ts` para produccion.

Antes de desplegar, cambiar la URL de produccion por la direccion publica del backend. Estos archivos son parte del frontend publico y no deben contener credenciales.

## Compilacion y servidor SSR

```powershell
npm run build
npm run serve:ssr:MANDAFRONT
```

La compilacion se genera en `dist/MANDAFRONT`. Los archivos `.env`, dependencias y compilados se excluyen de Git.
