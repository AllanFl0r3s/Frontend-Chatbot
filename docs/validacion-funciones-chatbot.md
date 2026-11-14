# Validación funcional del chatbot — 14 de noviembre de 2026

> Actualización posterior a este diagnóstico: se implementaron las fuentes académicas y correcciones de navegación. Los recorridos de las seis funciones pasan localmente; la migración SQL también está aplicada y verificada en Azure. Falta publicar el código y repetir el recorrido público. Ver [implementación y ejemplos actuales](menu-academico.md). El diagnóstico inicial se conserva como evidencia anterior a la corrección.

## Conclusión

**No todas las funciones del menú están operativas en el entorno académico local.** El recorrido de stock probado funciona con cinco productos; el sexto no se encuentra por nombre. Pedidos, ventas, proyecciones, notas de crédito y promociones abren algunos mensajes/menús, pero fallan al intentar completar la consulta. No presentar esos menús iniciales como evidencia de funcionamiento completo.

Esta comprobación es técnica, no una sesión con participantes ni una decisión sobre H3. No se realizaron cambios de código, commits, despliegues ni modificaciones de bases para corregir los fallos durante esta validación.

## Entornos y método

- Backend local: http://localhost:3021, commit 27b61d3, Node.js 22.23.5; dos bases de demostración SQL Server Express.
- Frontend al iniciar la revisión: commit 45e45a1, 24 commits locales. Se conserva el commit del propietario del 13/11.
- Peticiones HTTP reales autenticadas con la cuenta de demostración local. Se guardaron mensajes de prueba en su conversación y se cerró la sesión al finalizar; no se borraron usuarios ni se modificaron sus roles/contraseñas.
- Se ejecutó la suite existente chat.menu.spec.ts: 9 pruebas aprobadas, con SQL/repositorios simulados y rechazo de llamadas externas. Esas pruebas no certifican consultas contra todas las fuentes reales.
- La matriz HTTP básica contiene 15 comprobaciones: 14 correctas y 1 fallida (búsqueda de jabón). Las exploraciones de las cinco funciones heredadas son adicionales y contienen los errores 500 descritos abajo; no están incluidas en ese denominador.

## Resultados locales

| Función | Prueba realizada | Resultado |
|---|---|---|
| Login | Cuenta local de demostración | HTTP 201 y sesión válida. |
| Menú | `menu` | HTTP 201, muestra las seis opciones. |
| Stock guiado | `menu` → `1` → `agua` → `1` | Listado y detalle correctos: 135 total, 120 central y 15 en ruta. |
| Stock por nombre | `menu` antes de cada búsqueda: `stock de bebida`, `arroz`, `frijol`, `detergente` | Totales esperados 10, 85, 2 y 53, respectivamente. |
| Stock de jabón | `menu` → `stock de jabon`; repetir con `stock de jabón` | HTTP 201 pero dice que no encuentra el producto, pese a la semilla de 212 unidades. Fallo por investigar; no se limita a que el usuario escriba la tilde. |
| Producto inexistente | `menu` → `stock de producto inexistente` | Mensaje sin resultados, sin inventar existencias. |
| Pedidos | `menu` → `2` → `123456` | Solicita número, pero la consulta devuelve HTTP 500. |
| Ventas | `menu` → `3` → `1` → `agua` | Abre submenú, pero al buscar producto devuelve HTTP 500. |
| Proyecciones | `menu` → `4` → `1` → `agua` → `noviembre 2026` | Solicita producto y período, pero al consultar devuelve HTTP 500. |
| Notas de crédito | `menu` → `5` → `1` | Abre submenú; listar clientes devuelve HTTP 500. |
| Promociones | `menu` → `6` | HTTP 500. |
| Visitas | GET /visits/clients, S08, 2026-11-05, tamaño 5 | HTTP 200; 9 clientes y 13 registros. Es un endpoint/pantalla separado del chat. |
| Listar usuarios como administrador | GET /users autenticado | HTTP 200; no se publicaron los datos devueltos. No certifica creación/edición/eliminación. |
| Logout | POST /auth/logout y petición protegida posterior | HTTP 204 y rechazo 401 del token revocado. |

Cada búsqueda independiente se inicia con `menu`. Los errores se reprodujeron; no se reintentaron operaciones destructivas.

## Causa y límites de las funciones heredadas

Los servicios conservan consultas a fuentes del backend original que no forman parte de la restauración académica: dbo.VWchatbot_PEDIDO_DETALLE_S4 (pedidos), tablas comerciales IV00101/VentasCasaMarca (ventas), Proyecciones_TEST y productos heredados (proyecciones), dbo.ZFI_NOTAS_CREDITO (notas), pbx.TMP_IV00101 (promociones). Los registros locales muestran errores SQL de objeto inexistente. La búsqueda de stock usa las dos vistas académicas que sí fueron creadas.

Las cifras correctas de stock se contrastaron con la semilla de demostración. No se verificó IA conversacional general, ni se configuró una clave de pago o se certificó el envío de correo local. La recuperación pública permanece como confirmación manual del propietario del 13/11, no se repitió hoy.

## Aplicación pública: no revalidada en esta sesión

Se intentó comprobar https://chatbotbackendlocal-1.onrender.com desde esta conexión. Una solicitud de registro sintético agotó el tiempo de espera sin respuesta HTTP, y /health tampoco respondió dentro del plazo de 20 segundos. No se obtuvo sesión pública ni se enviaron mensajes de chat con ese intento.

El timeout **no demuestra** que el backend esté caído ni que el registro se haya revertido: no pudo confirmarse si la cuenta sintética llegó a persistirse. No se repitió el registro creando más cuentas. No se generaron ni enviaron correos en esta prueba. Las credenciales de prueba no se imprimieron ni guardaron. La confirmación pública de stock del 10/11 sigue siendo evidencia histórica, no una nueva prueba del 14/11.

El catálogo Azure utiliza Quartz, Plata Lite, Vitalit, Dropp y 220, mientras que el local utiliza los ejemplos genéricos. No trasladar los fallos ni los resultados locales como si se hubieran reproducido hoy en Azure.

Para revalidar en el navegador con una cuenta pública: `menu` → `1` → `Quartz 600ml` → `1`: 135 total, 120 + 15; reiniciar y consultar Plata Lite (85), Vitalit (2), Dropp (53) y 220 (212). Después comprobar inexistente y logout. Registrar fecha, rol y resultado sin copiar credenciales. Los otros flujos necesitan integración académica antes de certificarlos.

## Acción propuesta antes de invitar participantes

Definir y mostrar el alcance real del MVP: stock académico y visitas autorizadas. Las funciones no adaptadas deben dejar de ofrecerse como operativas o integrarse y verificarse. Mantener el rechazo de permisos y mensajes claros; no sustituir errores por resultados inventados. Resolver también la búsqueda local de jabón o excluir explícitamente ese catálogo local de las pruebas públicas. Crear issues con la evidencia y repetir las verificaciones después de cada corrección.

Este informe, la actualización de hallazgos y la bitácora son cambios reales listos para revisión/commit. Alcanzar 25 commits no sustituye las sesiones con usuarios ni los requisitos pendientes de semana 5.
