# Bitácora de semana 6

Fecha: 21 de noviembre de 2026, Honduras (UTC-6). **Entrega en preparación.**

## Qué revisamos hoy

Confirmamos que la versión universitaria está en `Desktop\Workspace\Proyecto inicial`, con frontend Frontend-Chatbot y backend ChatbotBackendLocal. La copia de trabajo está en `C:\Proyectos`; no se modificó durante este avance.

Los dos repositorios académicos estaban sin cambios pendientes. El frontend tenía 26 commits y el backend 14. Conservamos ese historial; no creamos commits vacíos ni dividimos cambios ya confirmados para inflar la cantidad.

## Trabajo realizado

- Escribimos [arquitectura](../arquitectura.md), con contexto, contenedores, capas del stack y carpetas de ambos repositorios.
- Registramos dos decisiones que ya estaban aplicadas: [entorno académico separado](../decisiones/001-separar-entorno-academico.md) y [permiso de visitas en el backend](../decisiones/002-autorizar-visitas-en-backend.md). No se presentan como funciones implementadas hoy.
- Preparamos la guía del [segundo flujo propuesto](../segundo-flujo.md) y repetimos la consulta de visitas contra HTTP y SQL local reales.
- Actualizamos el README y preparamos [borradores de issues y PR](../preparacion-pr-semana-6.md).

El propietario confirmó que todavía no ha hecho pruebas con otras personas. Visitas sigue siendo un candidato al segundo flujo; falta justificar la elección con resultados de usuarios. No se añadieron participantes ni resultados ficticios.

## Validación del 21/11

| Comprobación | Resultado | Qué demuestra |
|---|---|---|
| Backend: npm test -- --runInBand | 122 pruebas en diez suites correctas | Reglas, servicios y HTTP con dependencias simuladas según cada suite. |
| Backend: node --test test/visits.core.test.cjs | Diez pruebas correctas | Reglas de filtros, permisos, parámetros y respuesta. |
| Backend: npm run build | Correcto | Compilación de NestJS. |
| Frontend: npm run test:cloud-config | Dos pruebas correctas | Validación de la URL pública. |
| Frontend: npm run test:auth-session:node | Doce pruebas correctas | Lógica de sesión/interceptor; DOM y navegación simulados. |
| Frontend: npm run build:cloud con PUBLIC_API_URL del backend académico | Correcto | Build cloud; permanecen cuatro advertencias de tamaño de estilos. |
| API local y SQL académico real, backend e6ac25d | Doce comprobaciones correctas | Login, consulta, paginación, permisos, validaciones, logout y revocación. |
| HTTPS público del frontend, /login | HTTP 200 | La página se sirve; no certifica acceso ni consultas autenticadas. |
| API pública, /health y visitas sin JWT | Sin respuesta dentro de 45 segundos | No se pudo verificar la disponibilidad de la API en este intento. |
| GitHub: PR cerrados de ambos repositorios | Cero PR fusionados encontrados | El requisito de dos PR mezclados sigue pendiente. |

La consulta local usó CHATBOT y DW_ISTMA en 127.0.0.1:14330. Solo login/logout escribieron la sesión de acceso; no se crearon cuentas ni operaciones comerciales. El JWT quedó en memoria y no se incluyó en el [registro de resultados](../evidencias/semana-6/verificacion-visitas-local.json). El backend temporal fue detenido al terminar. No se revisó la interfaz en navegador durante este avance.

## Commits por avance

| Commit | Contenido |
|---|---|
| 301ec84 | Arquitectura del chatbot académico. |
| 62638d5 | Dos decisiones de entorno y permisos. |
| 844a431 | Recorrido de visitas y evidencia de verificación local. |
| Commit que incorpora esta bitácora | README, uso de IA, estado de entrega y preparación de issues/PR. |

Estos cuatro avances dejan el frontend con 30 commits locales. En la ventana desde el 11/11/2026 hay siete: tres anteriores y cuatro de hoy. El backend conserva sus 14 commits; no se suman ambos historiales para cumplir el mínimo del repositorio entregado. Los commits de hoy no se han enviado al remoto.

## Uso de IA

Usamos Codex para revisar archivos y diferencias de Git, redactar la documentación a partir del código, ejecutar las comprobaciones existentes y preparar un script temporal para verificar visitas por HTTP local. También se usó para preparar el PDF de este avance.

El propietario indicó cuál es la versión universitaria, pidió commits separados y una redacción sencilla, y confirmó que todavía no hay pruebas con participantes. La IA no realizó esas sesiones ni produjo evidencia de personas. La redacción se contrastó con código y salidas de las herramientas; las hipótesis de uso siguen pendientes de validación real.

## Estado frente a la entrega

| Requisito | Estado al cierre de este avance |
|---|---|
| docs/arquitectura.md | Preparado y confirmado localmente. |
| Al menos dos decisiones | Preparadas y confirmadas localmente. |
| Segundo flujo en producción elegido desde pruebas con usuarios | Pendiente; candidato visitas, HTTP/SQL local comprobados. |
| Dos PR mezclados con descripción e issues enlazados | Pendiente; solo borradores preparados. |
| docs/bitacora/semana-6.md y uso de IA | Preparados en este commit. |
| Release o etiqueta semana-6 | No creada; entrega todavía incompleta. |
| Al menos 30 commits y tres recientes | Cumplido en el frontend local después de estos cuatro commits; falta publicar. |
| Token de propiedad en README | Conservado sin cambios; falta revalidación en la plataforma de la universidad. |
| App pública HTTPS | Frontend respondió; API y recorrido autenticado pendientes de revalidación. |

## Qué sigue

Revisar el estado de Render y repetir el flujo público con una cuenta académica autorizada. Hacer las pruebas con personas usando el guion existente, registrar dificultades y decidir si visitas será el segundo flujo. Organizar/publicar los commits mediante dos PR con sus issues y registrar sus enlaces reales. Crear semana-6 cuando los requisitos estén completos y pegar las URLs del repo y la app en la plataforma.
