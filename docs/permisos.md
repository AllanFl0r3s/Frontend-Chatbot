# Permisos y propiedad de los datos

Actualizado: 6 de noviembre de 2026. Alcance: aplicación académica, con datos ficticios y bases locales CHATBOT/DW_ISTMA. Las funciones pendientes se indican expresamente; esta matriz no certifica todavía el despliegue público de semana 4.

## Roles actuales

| Rol | Identificador actual | Uso |
|---|---:|---|
| ADMINISTRADOR | 1 | Administrar cuentas, roles y perfil institucional; consultar rutas expresamente asignadas. |
| USUARIO | 2 | Personal interno que consulta el chat, el perfil institucional y sus rutas asignadas. |
| Visitante sin sesión | No es un rol almacenado | Puede abrir el login y solicitar autenticación; no consultar datos internos. |

Los IDs 1 y 2 provienen de la instalación académica. No se deduce un permiso del texto mostrado en pantalla. Otros roles no adquieren privilegios de administrador por tener un nombre similar. La ampliación futura a tres o más roles necesita definir sus acciones, no solo insertar un nombre en SQL.

## Matriz de endpoints existentes

Permiso indica que el servidor deja llegar a la operación, no que todas las funciones heredadas tengan datos locales o IA configurada. En operaciones protegidas, sin JWT válido corresponde 401; con JWT válido pero sin permiso, 403.

| Acción | Endpoint | Sin sesión | USUARIO (2) | ADMINISTRADOR (1) | Control actual del servidor |
|---|---|---|---|---|---|
| Solicitar login | POST /auth/login | Credenciales válidas | Credenciales válidas | Credenciales válidas | Contraseña bcrypt y estado del usuario. |
| Listar usuarios | GET /users | No | No | Sí | JwtAuthGuard + AdminGuard. |
| Consultar una cuenta | GET /users/:id | No | No, tampoco la propia por este endpoint | Sí | JwtAuthGuard + AdminGuard. |
| Crear una cuenta administrativamente | POST /users | No | No | Sí | JwtAuthGuard + AdminGuard; no es registro público. |
| Modificar una cuenta, contraseña o rol | PATCH /users/:id | No | No | Sí | JwtAuthGuard + AdminGuard. |
| Eliminar una cuenta | DELETE /users/:id | No | No | Sí | JwtAuthGuard + AdminGuard; faltan las reglas adicionales descritas abajo. |
| Listar roles | GET /roles | No | No | Sí | AuthGuard JWT + AdminGuard. |
| Consultar un rol | GET /roles/:id | No | No | Sí | AuthGuard JWT + AdminGuard. |
| Crear un rol | POST /roles | No | No | Sí | AuthGuard JWT + AdminGuard. |
| Modificar un rol | PATCH /roles/:id | No | No | Sí | AuthGuard JWT + AdminGuard; se protege el nombre/estado del rol administrador. |
| Eliminar un rol | DELETE /roles/:id | No | No | Sí, salvo el administrador | AuthGuard JWT + AdminGuard y reglas de RolesService. |
| Leer el perfil institucional | GET /perfil | No | Sí | Sí | AuthGuard JWT; es información compartida de la demostración. |
| Modificar el perfil institucional | PUT /perfil | No | No | Sí | AuthGuard JWT y comprobación roleId=1 en el controller. |
| Enviar mensaje al chat | POST /chat/message | No | Sí | Sí | AuthGuard JWT; usa el userId del token. Las consultas heredadas/IA no se certifican funcionales por este permiso. |
| Consultar clientes con registros de visita | GET /visits/clients | No | Solo rutas asignadas | Solo rutas asignadas | JWT + VISITS_ROUTE_ACCESS por usuario. No hay excepción para administrador. |
| Abrir el formulario de login | /login del frontend | Sí | Sí | Sí | No concede acceso a datos. La vista previa de Vercel mantiene el login deshabilitado. |
| Consultar la respuesta básica de inicio de API | GET / | Sí | Sí | Sí | Endpoint público sin datos comerciales. No se usa como prueba de disponibilidad de SQL. |
| Leer documentación Swagger | /api | Pública actualmente | Pública actualmente | Pública actualmente | La documentación no autoriza las operaciones protegidas. Revisar su exposición antes de publicar. |

Desde el avance 16, los cinco endpoints /users requieren administrador también en el servidor. Anteriormente solo exigían JWT: la guarda de Angular no bastaba para impedir llamadas directas de otro rol. El cambio del backend se conserva para revisión en [backend-permisos-usuarios.patch](../integraciones/backend-permisos-usuarios.patch).

## Funciones de semana 4 todavía pendientes

| Acción prevista | Quién podrá usarla | Regla obligatoria al implementarla | Estado |
|---|---|---|---|
| Registro público | Visitante | El servidor asigna USUARIO; no acepta elegir administrador, activar roles ni concederse rutas desde el formulario. | No hay endpoint ni formulario de registro público todavía. |
| Recuperar contraseña | Persona que controla el correo de su cuenta | Respuesta genérica, token con caducidad, un solo uso y almacenamiento protegido; envío al correo mediante el proveedor configurado. | No implementado. |
| Establecer contraseña recuperada | Portador del token válido de recuperación | Cambiar solo la cuenta vinculada al token; invalidar el token y las sesiones anteriores de esa cuenta. | No implementado. |
| Cerrar sesión en el servidor | Usuario autenticado, incluido administrador | Invalidar la sesión correspondiente; no aceptar un userId ajeno para cerrar otras sesiones. | Actualmente solo se retira token/usuario del navegador; el JWT puede seguir válido hasta vencer. |
| Desactivar usuario/rol o cambiar permisos | Administrador | Las solicitudes posteriores deben consultar el estado y permisos vigentes; no conservar privilegios por un JWT antiguo. | La estrategia JWT actual confía en los datos firmados hasta su caducidad; falta revalidación/revocación. |

Los nombres/rutas de los endpoints nuevos se concretarán con su implementación y se actualizará esta matriz. No se presenta como existente una recuperación de contraseña que solo tenga un botón o una simulación de correo.

## Propiedad y alcance del dato

1. **Identidad:** la establece el JWT validado. Un campo userId, roleId o nombre de rol enviado en URL/cuerpo/localStorage no concede permisos. El navegador puede ocultar enlaces, pero el servidor debe verificar cada solicitud.
2. **Cuentas y roles:** solo el administrador accede a /users y /roles. El usuario normal no puede elevar su rol usando PATCH /users/:id ni crear otra cuenta por ese endpoint. La edición personal, si se agrega después, necesitará su propio DTO limitado y una comprobación de propietario.
3. **Conversaciones web:** ChatController toma el userId del token. ChatService busca/crea la sesión WEB con ese Id_Usuario y guarda sus mensajes con el mismo usuario. No hay un endpoint de historial ajeno habilitado por esta matriz.
4. **Rutas y visitas:** los datos comerciales son compartidos únicamente dentro de la asignación explícita de cada cuenta. VISITS_ROUTE_ACCESS se configura en el servidor; vacío deniega todas las rutas. El rol administrador tampoco puede consultar una ruta no asignada. ClienteRuta expresa programación comercial, no autorización de usuarios.
5. **Perfil institucional:** es un recurso compartido de la única organización de esta demostración, no el perfil privado de una persona. Solo el administrador lo modifica. No hay aislamiento multiempresa implementado.
6. **Fuente local:** academico.Visitas/Clientes/Rutas contienen datos ficticios. El endpoint de visitas ejecuta solo SELECT. No permite elegir servidor, tabla o fuente SQL desde la URL.
7. **Contraseñas y tokens:** PasswordHash no se devuelve al frontend. El .env y sus secretos no se publican. Las cuentas operativas y credenciales por rol para el docente se compartirán fuera del repositorio.

## Reglas adicionales que faltan antes de certificar semana 4

- Crear y comprobar al menos dos cuentas de demostración con roles diferentes. La instalación actual incluye dos roles, pero la semilla original solo crea una cuenta administradora.
- Revalidar usuario/rol activos en el servidor y resolver la revocación al cerrar sesión, recuperar contraseña, desactivar una cuenta o cambiar permisos.
- Impedir que el administrador elimine/desactive la última cuenta administradora o pierda acceso por modificar su propia cuenta de forma insegura.
- Revisar el borrado físico de usuarios: sesiones y mensajes heredados pueden quedar huérfanos. Preferir desactivación y definir conservación/integridad antes de habilitar borrados en el entorno público.
- Comprobar que se asignan roles existentes y activos; crear nuevos nombres de rol no define por sí solo una política de acceso.
- Probar acceso permitido y denegado con cuentas reales por rol, además de las pruebas automatizadas.
- Configurar el despliegue HTTPS del frontend/backend/base, el proveedor de correo y las cuentas privadas de entrega. Las contraseñas ficticias publicadas durante las pruebas locales de semana 3 no deben reutilizarse para la entrega pública.

## Cómo verificar el primer control corregido

En el backend académico:

```powershell
npm run build
npm test -- --runInBand users.permissions.spec.ts
```

Las pruebas ejercen HTTP y JWT reales con persistencia simulada, sin crear ni eliminar cuentas SQL. Cubren los cinco métodos de /users con 401 para visitante, 403 para USUARIO y acceso permitido para ADMINISTRADOR; también intentos de elevar el rol propio, token vencido y firma alterada.

La suite de visitas se conserva para comprobar que el cambio no amplía permisos de rutas:

```powershell
npm test -- --runInBand visits.academic.spec.ts visits.spec.ts
```

Para comprobarlo manualmente después de crear la segunda cuenta, usar su token desde Swagger o un cliente HTTP e intentar GET /users y PATCH /users/:id con roleId=1. Ambos deben responder 403; no basta con que Angular oculte la pantalla.

## Resultado registrado el 6 de noviembre de 2026

Compilación correcta y 20 pruebas aprobadas en tres suites: 8 nuevas de usuarios,
7 de servicio de visitas y 5 HTTP de visitas. El cambio de servidor quedó en el
commit 1e74862 del backend académico. La validación detallada se registra en
[bitácora semana 4](bitacora/semana-4.md). No se han creado todavía las cuentas
privadas de demostración por rol ni se ha certificado el flujo público.
