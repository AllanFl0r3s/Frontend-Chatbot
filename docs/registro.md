# Registro de cuentas — avance 17

Actualizado el 6 de noviembre de 2026. Alcance: entorno académico local con datos ficticios. La publicación HTTPS sigue pendiente.

## Probar desde la aplicación

1. Iniciar o reiniciar el backend académico con `npm run start:dev`, puerto 3021.
2. Iniciar el frontend con `npm start` desde Frontend-Chatbot, puerto 4200.
3. Abrir [Crear cuenta](http://localhost:4200/register), o pulsar ese enlace desde el login.
4. Completar nombre, usuario, correo, contraseña y confirmación. Usar una contraseña propia de al menos 12 caracteres.
5. Después del mensaje de cuenta creada, pulsar Iniciar sesión y utilizar el usuario o correo elegido.

El formulario no permite elegir rol ni rutas. La cuenta nueva es USUARIO y el acceso a rutas lo habilita la administración. Registrarse no inicia sesión automáticamente. La vista previa de Vercel mantiene el formulario deshabilitado y no envía contraseñas al localhost del visitante.

## Contrato del backend

`POST /auth/register` es público y separado de `POST /users`, que sigue siendo exclusivo de administrador. Solo acepta estos cuatro campos:

| Campo | Validación |
|---|---|
| nombre | Texto, recortado, entre 2 y 150 caracteres. |
| usuario | Se recorta y convierte a minúsculas; de 3 a 50 letras ASCII/números/puntos/guiones/guiones bajos; empieza con letra o número. |
| email | Se recorta y convierte a minúsculas; correo válido de hasta 150 caracteres. |
| password | Al menos 12 caracteres y como máximo 72 bytes UTF-8, para evitar que bcrypt trunque contraseñas. No se recorta ni convierte a minúsculas. |

La confirmación solo se usa en el formulario y no se envía al servidor. La comprobación del correo valida su formato; todavía no verifica la propiedad de la dirección mediante un mensaje.

El servidor busca el rol académico ID 2 y comprueba que sea USUARIO y esté activo. Lo asigna explícitamente, junto con estado activo y fecha de registro. Rechaza campos como roleId, role, estado, id o passwordHash antes de que el whitelist global los elimine. No concede rutas ni acepta elegirlas desde el formulario.

Busca identificadores sin distinguir mayúsculas y considera ambos campos de login para evitar ambigüedades. Los índices UNIQUE de SQL siguen siendo la última protección ante registros simultáneos. Los errores SQL 2601/2627 se traducen a 409; otros fallos no exponen detalles privados del proveedor.

La contraseña se guarda mediante bcrypt, coste 12. La respuesta exitosa es 201 y contiene solo un mensaje: no devuelve contraseña, hash ni JWT. El inicio de sesión se hace después en el endpoint existente. Ese login ahora también rechaza roles inactivos; revalidar o revocar JWT emitidos anteriormente sigue siendo un trabajo pendiente.

| Estado | Significado |
|---|---|
| 201 | Cuenta creada. |
| 400 | Datos inválidos o campos no permitidos. |
| 409 | Correo o usuario no disponible. |
| 503 | Rol de registro no disponible o fallo de persistencia. |

No se necesita una migración nueva: se reutilizan TBL_USUARIOS, TBL_ROLES y los índices únicos ya existentes. No volver a crear CHATBOT ni DW_ISTMA para probar el registro.

## Validación realizada

- Backend: compilación correcta y 42 pruebas en 4 suites aprobadas (22 de registro/login y 20 de permisos/visitas).
- Frontend: compilación de desarrollo/SSR y compilación preview correctas. Preview conserva avisos de tamaño de estilos heredados y no habilita el backend público.
- HTTP con SQL Server local real, usando la aplicación completa en un puerto temporal de loopback: 8 comprobaciones correctas. Se creó una cuenta de demostración USUARIO, se inició sesión, se comprobó acceso permitido al perfil y denegado a administración/ruta no asignada, duplicados, campos privilegiados y acceso del administrador existente.
- El servidor temporal de prueba se cerró al terminar. La prueba no cambió la contraseña del administrador ni concedió rutas a la cuenta nueva.

Las pruebas automáticas cubren normalización, hash y respuesta sin secretos, login posterior, protección administrativa, campos privilegiados, datos inválidos/Unicode, duplicados y errores de persistencia, configuración de rol y login con rol inactivo. La suite usa persistencia simulada; la comprobación HTTP/SQL real se realizó aparte. Todavía falta confirmar el formulario interactivo en el navegador del autor.

## Cuentas de demostración

Ya existen dos roles con cuentas comprobadas localmente: administrador y usuario. El identificador y la contraseña de la nueva cuenta de prueba se guardaron en un archivo privado fuera de los repositorios de frontend y backend. No se incluyen aquí ni se enviaron al docente automáticamente.

Son cuentas locales de demostración. Las cuentas y credenciales para la entrega pública se prepararán y compartirán por un canal privado. No reutilizar las contraseñas ficticias conocidas de la instalación local como credenciales públicas.

## Qué sigue pendiente

- Recuperación de contraseña y proveedor real de correo.
- Logout con invalidación en servidor y revocación/revalidación de tokens existentes.
- Pruebas manuales de la interfaz, límites de intentos y configuración de publicación.
- Backend y base académica públicos por HTTPS, cuentas privadas de entrega y release semana-4.

El cambio complementario del backend se conserva para revisión en [backend-registro-usuarios.patch](../integraciones/backend-registro-usuarios.patch). Ya está aplicado en la carpeta académica habitual; no hay que importar ese parche otra vez allí.
