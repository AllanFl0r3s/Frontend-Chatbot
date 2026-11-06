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

## Estado frente a la entrega de semana 4

| Requisito | Estado actual |
|---|---|
| Login | Funciona localmente; pendiente en la URL pública. |
| Registro público | Pendiente; POST /users es creación administrativa, no registro público. |
| Logout | El navegador retira sus datos de sesión; falta invalidación en servidor. |
| Recuperación de contraseña | Pendiente de backend, frontend y entrega real de correo. |
| Matriz de permisos y propiedad | Primera versión documentada y control /users corregido. |
| Dos roles funcionales | Existen ADMINISTRADOR y USUARIO y se probaron controles con JWT; falta la segunda cuenta real de demostración y pruebas completas por rol. |
| Credenciales para el docente | Pendientes de crear y compartir fuera del repositorio. No se publicarán aquí. |
| Validación de usuarios/roles vigentes | Falta revalidar estado y resolver revocación de tokens anteriores tras cambios. |
| Frontend, backend y base públicos por HTTPS | Pendiente. Vercel sigue siendo una vista previa. |
| Release semana-4 | No creado todavía. |
| 20 commits y 3 recientes | El primer avance deja 16 commits en el frontend; continuar con cambios útiles hasta cumplir el mínimo y los requisitos funcionales. |

## Siguiente paso

Implementar el registro con rol USUARIO asignado por el servidor y sus validaciones, preparar las cuentas de demostración y comprobar los estados/roles vigentes. Después continuar con recuperación, cierre de sesión, despliegue y prueba completa. El presupuesto autorizado es cero: solo planes gratuitos o créditos estudiantiles comprobados antes de crear recursos.
