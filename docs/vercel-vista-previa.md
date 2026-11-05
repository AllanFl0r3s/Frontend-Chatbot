# Vista previa visual en Vercel

Esta publicación muestra la pantalla de acceso. Por ahora no permite iniciar sesión
ni consulta el backend local, SQL Server u OpenAI. La pantalla incluye un aviso
visible para evitar que quien la visite espere una conexión con la computadora local.

El desarrollo local continúa con npm start y el backend en localhost:3021.

## Construcción

```powershell
npm ci
npm run build:preview
```

La configuración preview de angular.json genera archivos estáticos en
`dist/preview/browser`. Reemplaza environment.ts por environment.preview.ts;
visualPreview=true desactiva el formulario de acceso y evita enviar contraseñas.
Las configuraciones development y production conservan el login local.

vercel.json fija Build Command = npm run build:preview y Output Directory =
dist/preview/browser. Se publica sin un servidor Node SSR. Las rutas del navegador
se resuelven mediante index.html.

No se deben cargar las variables de entorno del backend en Vercel. Los archivos
.env, claves y metadatos .vercel quedan excluidos del repositorio o del envío.

Para probar el login desde un enlace público en una etapa posterior, hará falta
publicar un backend de demostración y configurar su URL HTTPS y los datos ficticios.
