# Plan de semana 4 — login y roles

Fecha de revisión: 6 de noviembre de 2026. Presupuesto autorizado: **sin costo**, usando servicios gratuitos o créditos estudiantiles. Ningún recurso de pago ni cobro adicional está autorizado.

El frontend parte de 15 commits. La entrega exige al menos 20 en total, con 3 en los últimos 10 días. El número es un mínimo de historial, no sustituye que las funciones y permisos estén probados. Los avances se harán por cambios útiles; si hacen falta más de cinco, no se recortarán pruebas para detenerse en 20.

## Estado y orden de trabajo

| Avance | Trabajo | Estado |
|---|---|---|
| 16 | Auditar permisos, crear docs/permisos.md y exigir administrador en /users desde el backend. | Primer paso completado: compilación y 20 pruebas correctas; ver bitácora de semana 4. |
| 17 | Registro público con rol USUARIO fijado por servidor, formulario y segunda cuenta local de demostración. El login comprueba rol activo; revalidar JWT existentes sigue pendiente. | Implementado y comprobado: 42 pruebas y 8 comprobaciones HTTP/SQL reales; ver docs/registro.md. |
| 18 | Recuperación de contraseña y revalidación JWT, enlace limitado y cambio atómico, integración Brevo y pantallas. | Implementado y probado localmente; falta configurar proveedor y recibir correo real. Ver recuperacion-contrasena.md. |
| Siguiente | Cierre de sesión con invalidación en servidor y reglas de acceso/propiedad, con pruebas permitidas y denegadas por rol. | Pendiente. |
| Cierre | Publicar el flujo por HTTPS con base académica, probar cuentas por rol, completar docs/bitacora/semana-4.md y release semana-4. | Pendiente. No se marca entregado todavía. |

La matriz actual, los controles corregidos y los huecos pendientes se describen en [permisos.md](permisos.md). Las credenciales por rol se entregarán al docente fuera del repositorio; no se agregarán contraseñas operativas a la bitácora ni a ejemplos públicos.

## Publicación sin costo: opciones por comprobar

Se revisaron las fuentes oficiales el 6 de noviembre de 2026. Todavía no se eligieron ni crearon recursos:

- [Azure SQL Database gratuito](https://learn.microsoft.com/en-us/azure/azure-sql/database/free-tier-faq?view=azuresql): tiene cuotas mensuales y una opción de pausar al agotarlas. La oferta Students Starter no es compatible; hay que comprobar qué suscripción estudiantil tiene el autor. Solo se considerará una configuración que se detenga en el límite gratuito, sin habilitar cobros adicionales.
- [Servicio web gratuito de Render](https://render.com/docs/free): posible candidato para una demostración académica del backend, sujeto a límites y pausa por inactividad. El plan gratuito bloquea los puertos SMTP habituales, por lo que la recuperación de contraseña necesitaría un proveedor mediante API HTTPS compatible con el presupuesto.
- El frontend ya tiene Vercel, pero su publicación actual solo muestra la interfaz. Se mantendrá esa vista hasta configurar un backend y una base accesibles desde el despliegue público.

La elegibilidad de las cuentas y los límites se verificarán antes de publicar. Los scripts locales contienen comprobaciones de SQLEXPRESS: habrá que preparar migraciones adecuadas para el proveedor elegido, sin quitar a ciegas las protecciones de los scripts locales ni exponer el SQL Server de la computadora.

## Criterio de cierre

Registro, login, logout y recuperación deben poder probarse en la URL pública. Las acciones administrativas deben denegarse al usuario normal desde la API; las cuentas por rol deben ser reproducibles y sus credenciales compartirse privadamente. Solo después se registrarán los resultados reales de la prueba y se preparará el release semana-4.
