# Bitácora — semana 5: MVP con usuarios reales

**En preparación; entrega incompleta.** 13 de noviembre de 2026, Honduras (UTC-6).

## Contexto y alcance

Se recuperó el contexto desde código, Git y documentación tras formatear la PC. Backend académico ChatbotBackendLocal: main, 27b61d3. Frontend Frontend-Chatbot: main, 19b4ab7 al iniciar esta revisión. Los documentos de esta preparación aún no se han confirmado ni publicado.

La app pública usa Vercel, NestJS en Render y bases Azure SQL CHATBOT/DW_ISTMA. Separadamente se restauró el entorno local con Node 22.23.5, npm 10.9.9, SQL Server Express y semilla ficticia; no se copiaron datos de Azure. El catálogo público contiene Quartz/Vitalit/Dropp y otras marcas; el local conserva los ejemplos genéricos anteriores. No certificar ventas, pedidos, promociones ni IA general por aparecer en el menú.

## Evidencia disponible

| Evidencia | Entorno/origen | Resultado y límite |
|---|---|---|
| Compilación backend y 115 pruebas en 9 suites | Local, esta conversación | Correctas; persistencia simulada donde corresponde. |
| Compilación cloud y 14 pruebas frontend | Local, esta conversación | Correctas; advertencias de tamaño de estilos. |
| Login, visitas, logout | SQL local restaurado | Correctos; S08 2026-11-05: 9 clientes/13 registros; logout 204. |
| Recuperación pública | Confirmación del propietario, 13/11 | Configuró Brevo en Render y confirmó recuperación. Rechazos de enlace reutilizado y contraseña anterior en nube pendientes. |
| Publicación HTTPS | Comprobación técnica 13/11, 15:38 Honduras (21:38 UTC) | Vercel /login 200; Render /health 200 con status ok; OPTIONS /auth/login 204 con origen Vercel correcto; GET /users sin token 401. |

Las comprobaciones públicas fueron de lectura/preflight: no crearon cuentas ni enviaron correos. Health no demuestra todo el acceso SQL ni los recorridos autenticados. Las pruebas iniciales usaron el Node interno de Codex; los procesos locales se iniciaron posteriormente con Node 22 instalado. Las pruebas automatizadas no sustituyen sesiones con usuarios.

## Trabajo de preparación

El propietario aún no tiene participantes. Se prepararon [guion, registro y criterios de decisión](../pruebas-usuarios.md) y [hallazgos con borradores de issues](../hallazgos-semana-5.md). Se fija el umbral de H3 antes de medir. No se publican nombres, credenciales ni resultados inventados. No se cambió ni desplegó código por esta preparación documental.

## Checklist

| Requisito | Estado al 13/11/2026 | Pendiente |
|---|---|---|
| MVP por HTTPS y recorrido por rol | Disponibilidad básica comprobada | Recorrido público completo de cada rol participante, stock y visitas autorizadas. |
| docs/pruebas-usuarios.md | Preparado | Participantes reales, resultados, frecuencia y decisión. |
| Issues graves/bloqueantes priorizados | Borradores | Crear/enlazar los issues reales y añadir hallazgos de sesiones. |
| Bloqueantes corregidos/verificados | No evaluado con participantes | Identificar, corregir y repetir en producción antes del cierre. |
| Bitácora semana 5 | En progreso | Resultados finales, issues y evidencia de despliegues. |
| Release/etiqueta semana-5 | No creado | Crear al completar los requisitos. Frontend ya tiene semana-1 a semana-4. |
| ≥25 commits en repo entregado | Frontend 23; backend 13 | Faltan 2 en frontend si se entrega ese repo; solo avances reales, sin sumar historiales ni commits vacíos. |
| ≥3 commits en últimos 10 días | Frontend 15 desde 03/11/2026 | Revalidar según fecha efectiva de entrega. |
| Token de propiedad en README | Existente | Conservar y comprobar el repo entregado en la plataforma. |

## Siguiente avance

Invitar participantes y preparar cuentas/rutas privadamente. Realizar primero una sesión USUARIO; anotar tiempos, ayuda y hallazgos. Repetir con ADMINISTRADOR usando una cuenta ficticia editable, sin eliminar/desactivar al último administrador. Crear issues, corregir los bloqueantes y verificarlos públicamente antes del release.

## 14 de noviembre — validación de las funciones antes de las sesiones

El propietario confirmó el avance documental anterior en 45e45a1: frontend con 24 commits antes de esta actualización. No se ha creado el commit siguiente ni el release semana-5.

Se ejecutaron 9 pruebas automatizadas de menú, aprobadas, y peticiones autenticadas contra SQL local: stock de cinco productos y detalle por bodega, visitas, lectura administrativa y logout correctos. Buscar jabón falla con y sin tilde. Pedidos, ventas, proyecciones, notas de crédito y promociones devuelven 500 al completar la consulta por fuentes heredadas no disponibles. La presencia de un submenú no prueba que la función esté integrada.

El intento de revalidar el backend público terminó sin respuesta dentro del plazo; no se obtuvo una sesión pública. No se extrapolan estos resultados locales a Azure. Se documentaron método, pasos, resultados y limitaciones en [validación funcional](../validacion-funciones-chatbot.md). Se propone alinear el menú con el alcance académico antes de invitar participantes. Las sesiones y la decisión sobre H3 siguen pendientes; estos resultados son técnicos.
