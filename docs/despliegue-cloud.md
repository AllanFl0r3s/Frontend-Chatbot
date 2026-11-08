# Conectar Vercel con el backend público

Estado al 7 de noviembre de 2026: frontend publicado en https://chatbot-clase-vista-previa.vercel.app y conectado a https://chatbotbackendlocal-1.onrender.com. El vercel.json activo usa build:cloud. La ejecución local sigue separada.

## Configuración

1. Publicar y verificar el backend con sus dos bases Azure.
2. En Vercel → Settings → Environment Variables agregar PUBLIC_API_URL con el origen HTTPS real del backend, sin /api, /auth ni parámetros. Ejemplo de formato únicamente: https://nombre-real.onrender.com. No copiar este ejemplo como URL real.
3. Cuando el backend esté verificado, aplicar el contenido de vercel.cloud.json al vercel.json activo y publicar ese cambio. Build Command: npm run build:cloud; Output Directory: dist/cloud/browser. Un cambio de variable requiere un nuevo despliegue.
4. Abrir /register, crear una cuenta ficticia e iniciar sesión. Verificar roles, visitas y logout desde el dominio HTTPS, también en un segundo navegador.

El build genera environment.cloud.generated.ts (ignorado por Git) usando únicamente PUBLIC_API_URL. Si falta la variable o no es un origen HTTPS válido, el build falla en vez de publicar una URL localhost. No se cambia environment.ts ni environment.prod.ts: la ejecución local sigue apuntando al backend local.

Nunca poner en Vercel/frontend contraseñas SQL, JWT_SECRET, PASSWORD_RESET_SECRET, claves Brevo ni claves OpenAI. El navegador solo necesita la URL pública.

## Demostración

Las visitas ficticias están fechadas 2026-11-05. S08 devuelve 9 clientes y 13 registros cuando el usuario tiene esa ruta autorizada en el backend. Ver la interfaz de chat no demuestra que la IA esté configurada.

Pruebas de configuración: npm run test:cloud-config. Pruebas de sesión: npm run test:auth-session:node.

Validación del 7 de noviembre de 2026: dos pruebas de configuración y doce de sesión correctas. Build cloud estático correcto. La optimización cloud conserva el enlace de fuentes para el navegador y evita descargarlas al compilar.

Despliegue Vercel verificado: dpl_4EKMENQYDAusTJvvR2s8Q5o1tJN1, estado READY, dominio público sin autenticación de Vercel. PUBLIC_API_URL está configurada en Production y Preview. El enlace /register muestra el formulario funcional.

Prueba HTTP real: health 200, CORS para el dominio Vercel, registro 201, login 201 con rol USUARIO, administración rechazada 403, logout 204 y token revocado rechazado 401. Se creó una única cuenta sintética de verificación, sin datos personales ni correo enviado; su contraseña y token no se guardaron ni imprimieron. No se ha certificado recuperación por correo en nube ni una consulta de visitas autenticada: faltan la configuración privada de Brevo y la asignación de rutas a las cuentas autorizadas. La IA continúa sin configurar.
