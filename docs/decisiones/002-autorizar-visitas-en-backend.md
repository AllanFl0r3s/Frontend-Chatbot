# 002. Comprobar el permiso de ruta en el backend

Fecha del registro: 21/11/2026. Estado: aplicada en el código existente y documentada en esta revisión.

## Contexto

La pantalla de visitas permite escribir una ruta y una fecha. Si confiáramos solo en ese formulario o en el rol mostrado por Angular, una persona podría cambiar la petición HTTP y consultar otra ruta. Una cuenta administradora tampoco debería obtener todas las rutas por el solo hecho de gestionar usuarios.

## Decisión

Obtener la identidad desde el JWT validado por NestJS y comprobar la asignación del usuario en `VISITS_ROUTE_ACCESS` antes de ejecutar SQL. Sin asignación se devuelve 403, incluso al administrador. Una petición sin un JWT válido recibe 401.

El servicio valida ruta, fecha y paginación; después ejecuta una consulta permitida con parámetros. El cliente no envía nombres de tablas ni decide la fuente. En la configuración académica se leen `academico.Visitas`, `Clientes` y `Rutas`.

## Alternativas consideradas

| Alternativa | Motivo para descartarla ahora |
|---|---|
| Ocultar rutas en Angular y confiar en el formulario | No impide llamar directamente al endpoint. |
| Permitir todas las rutas al rol administrador | Mezcla la administración de cuentas con el acceso a información por ruta. |
| Aceptar el ID del usuario desde el formulario | Permite solicitar el ámbito de otra persona. |
| Crear ya un módulo de asignaciones en SQL | Es una evolución posible, pero todavía falta definir su administración; la lista del servidor cubre la demostración actual. |

## Consecuencias

El mismo control protege llamadas desde la interfaz y desde cualquier cliente HTTP. Las rutas se asignan de forma expresa. Para la demostración pública hay que preparar esa asignación; crear una cuenta o darle rol administrador no basta.

La lista JSON en configuración es sencilla, pero los cambios requieren actualizar el entorno del backend. Si aumenta el número de usuarios o rutas, convendrá mover las asignaciones a persistencia con su propia administración y auditoría. Esa evolución no está implementada.

Las respuestas distinguen 400 por filtros inválidos, 401 por sesión inválida, 403 por ruta no autorizada y 503 por configuración/fuente no disponible. Un error SQL no se convierte en cero visitas.

## Dónde se ve y cómo se comprueba

- Backend: `src/auth/jwt.strategy.ts`, `src/visits/visits.controller.ts`, `visits.service.ts` y `visits.core.ts`.
- Frontend: `src/app/core/auth.interceptor.ts` y `src/app/visits/visits-api.service.ts`.
- `src/visits/visits.spec.ts`: HTTP/JWT con SQL simulado, incluidos 401, 403, 400 y 503.
- `src/visits/visits.academic.spec.ts`: fuente académica, parámetros y asignaciones con SQL simulado.

Las suites están dentro de las 122 pruebas del backend aprobadas el 21/11/2026. No sustituyen la prueba autenticada sobre Azure ni una sesión con participantes. Ver [segundo flujo](../segundo-flujo.md).
