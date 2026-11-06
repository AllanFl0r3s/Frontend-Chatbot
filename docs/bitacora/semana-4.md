# Bitácora — Semana 4: login y roles

**Estado: en progreso.** Actualizado el 6 de noviembre de 2026. Esta bitácora registra avances comprobados y no declara completada la entrega pública.

## Primer avance: permisos de administración

Se revisaron los controllers, las guardas JWT, los roles y las reglas de visitas. Se encontró que Angular protegía la pantalla de usuarios para administrador, pero los cinco endpoints /users solo exigían JWT. Una cuenta autenticada de otro rol podía llegar a operaciones administrativas si llamaba directamente a la API.

Se corrigió UsersController para ejecutar primero JwtAuthGuard y luego AdminGuard en todos sus métodos. Se registró la guarda en UsersModule y se ajustó su mensaje para que sirva tanto para usuarios como para roles. No se modificaron las bases de la empresa ni se crearon/eliminaron cuentas durante las pruebas.

La matriz de acciones y roles, las reglas de propiedad y las limitaciones pendientes están en [permisos.md](../permisos.md). El orden de los siguientes avances está en [plan-semana-4.md](../plan-semana-4.md).

## Resultado de las pruebas del avance 16

En el backend académico se ejecutó:

```powershell
npm run build
npm test -- --runInBand users.permissions.spec.ts visits.academic.spec.ts visits.spec.ts
```

Resultado: compilación correcta, **3 suites y 20 pruebas aprobadas**.

| Grupo | Casos aprobados | Alcance |
|---|---:|---|
| Administración de usuarios | 8 | Los cinco endpoints rechazan visitante con 401 y USUARIO con 403, y admiten ADMINISTRADOR. También se prueban ascenso de rol propio, JWT vencido y firma alterada. |
| Servicio académico de visitas | 7 | Fuente académica/legacy, configuración inválida, permisos de ruta, fecha inválida, errores y paginación. |
| HTTP de visitas | 5 | JWT obligatorio, rutas autorizadas, fecha, contrato de respuesta y error SQL sin detalles privados. |

Estas pruebas usan HTTP/JWT reales con persistencia o fuente SQL simuladas. No equivalen a crear y probar todavía dos cuentas reales por rol en producción. Las cinco pruebas HTTP de visitas que antes estaban bloqueadas por la terminal pudieron ejecutarse en esta sesión con el permiso de red de prueba.

## Avance 17: registro público y login posterior

Se agregó POST /auth/register y el formulario /register enlazado desde el login. El servidor rechaza campos de privilegios, asigna USUARIO (ID 2 activo), normaliza usuario/correo, valida duplicados y guarda bcrypt. La contraseña debe tener al menos 12 caracteres y no superar los 72 bytes que admite bcrypt. La respuesta no entrega JWT ni hash: después se inicia sesión por el flujo existente.

El login también rechaza cuentas con rol inactivo. La revalidación/revocación de JWT ya emitidos continúa pendiente. No se agregaron columnas ni se recrearon las bases locales.

Resultados del 6 de noviembre:

- Backend compilado y **42 pruebas aprobadas** en 4 suites (22 nuevas y 20 de regresión).
- Frontend compilado para desarrollo/SSR y para preview. La vista previa mantiene el registro deshabilitado.
- **8 comprobaciones HTTP contra SQL real** correctas: registro persistido, login USUARIO, administración denegada, perfil permitido, ruta no asignada denegada, duplicado 409, campos de privilegios 400 y login/acceso administrativo preservados.
- Se creó una cuenta local USUARIO para demostrar el segundo rol. Sus credenciales se guardaron fuera de los repositorios de frontend/backend; no se enviaron al docente automáticamente. El administrador conserva su contraseña y no se concedieron rutas nuevas.
- La prueba HTTP arrancó la aplicación en un puerto temporal de loopback y la cerró al terminar. El formulario interactivo en el navegador sigue pendiente de confirmación por el autor; no se publicó este cambio en Vercel.

La guía está en [registro.md](../registro.md). Son cuentas locales con datos ficticios; las cuentas para la entrega pública se prepararán aparte y se compartirán privadamente.
## Estado frente a la entrega de semana 4

| Requisito | Estado actual |
|---|---|
| Login | Funciona localmente; pendiente en la URL pública. |
| Registro público | Implementado y probado localmente con POST /auth/register; falta publicar y confirmar la interfaz interactiva. |
| Logout | El navegador retira sus datos de sesión; falta invalidación en servidor. |
| Recuperación de contraseña | Pendiente de backend, frontend y entrega real de correo. |
| Matriz de permisos y propiedad | Primera versión documentada y control /users corregido. |
| Dos roles funcionales | ADMINISTRADOR y USUARIO comprobados por HTTP con SQL local y cuentas reales de demostración; falta la validación completa en producción. |
| Credenciales para el docente | La cuenta USUARIO local tiene sus credenciales fuera del repositorio; las de la entrega pública y su comunicación privada siguen pendientes. |
| Validación de usuarios/roles vigentes | Falta revalidar estado y resolver revocación de tokens anteriores tras cambios. |
| Frontend, backend y base públicos por HTTPS | Pendiente. Vercel sigue siendo una vista previa. |
| Release semana-4 | No creado todavía. |
| 20 commits y 3 recientes | El avance de registro deja 17 commits en el frontend; continuar hasta cumplir el mínimo y los requisitos funcionales. |

## Siguiente paso

Continuar con recuperación de contraseña y proveedor de correo; después cierre de sesión con invalidación en servidor, revalidación de JWT, despliegue y prueba completa. El registro y la segunda cuenta local ya están comprobados. El presupuesto autorizado es cero: solo planes gratuitos o créditos estudiantiles comprobados antes de crear recursos.
