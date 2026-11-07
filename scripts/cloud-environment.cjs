const fs = require('node:fs');
const path = require('node:path');

function apiOrigin(value) {
  if (!value) throw new Error('Falta PUBLIC_API_URL: usa el origen HTTPS del backend publicado.');
  const url = new URL(value);
  if (url.protocol !== 'https:' || url.username || url.password
    || url.search || url.hash || url.pathname !== '/') {
    throw new Error('PUBLIC_API_URL debe ser un origen HTTPS sin ruta, credenciales ni parámetros.');
  }
  if (['localhost', '127.0.0.1', '[::1]'].includes(url.hostname)) {
    throw new Error('PUBLIC_API_URL debe apuntar al backend público.');
  }
  return url.origin;
}

if (require.main === module) {
  // Solo la URL pública llega al bundle: jamás copiar aquí claves, JWT ni contraseñas SQL.
  const apiUrl = apiOrigin(process.env.PUBLIC_API_URL);
  fs.writeFileSync(path.join(__dirname, '../src/environments/environment.cloud.generated.ts'),
    `// Generado durante build:cloud. No editar ni guardar secretos.\nexport const environment = ${JSON.stringify({
      production: true, visualPreview: false, apiUrl,
    }, null, 2)};\n`);
  console.log('Configuración pública HTTPS preparada.');
}
module.exports = { apiOrigin };
