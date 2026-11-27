# Bitácora de semana 7

Fecha de trabajo: 27 de noviembre de 2026. Autor del proyecto: Allan Flores. Entrega principal: [Frontend-Chatbot](https://github.com/AllanFl0r3s/Frontend-Chatbot). Backend de referencia: [ChatbotBackendLocal](https://github.com/AllanFl0r3s/ChatbotBackendLocal), commit b30c2298f200873c25edc1550ecfe6c02b7ea655.

## Problema y tercer flujo

El chatbot ya permitía consultar cartera con mensajes, pero requería conocer los pasos del menú y todavía no había un pipeline. El tercer flujo propuesto para mezclar mediante PR es el acceso guiado a la cartera de la ruta asignada: login del vendedor, botón Consultar mi cartera, consulta de una pulpería y cierre de sesión.

El botón conserva el borrador, evita consultas duplicadas y detiene la secuencia cuando la cuenta no tiene ruta. Los permisos siguen decidiéndose en el backend. La prueba E2E atraviesa Angular, HTTP, autenticación JWT, negocio y SQL; no simula respuestas de red ni usa datos empresariales.

## Cambios realizados

- Estrategia por riesgos y niveles en `docs/pruebas.md`.
- Workflow por push y PR, con comprobaciones `Frontend: pruebas y build` y `E2E: cartera con SQL`.
- Preparación de bases CHATBOT_WEEK7_CI y DW_ISTMA_WEEK7_CI, cincuenta pulperías y cuentas ficticias. El backend se obtiene por SHA para evitar que cambie sin revisión.
- Pruebas de permisos, dinero con centavos, factura pagada, cambio de ruta, revocación y recorrido de usuario.
- Prueba generada de la aplicación actualizada: la raíz usa router-outlet y no el título de bienvenida de la plantilla original.
- Corrección del lanzador de Karma para usar Chromium Headless Shell: Chrome completo no se conectaba al runner local.
- Workflow manual de release que valida las condiciones antes de crear la etiqueta y release semana-7.

## Resultados observados

| Comprobación | Resultado del 27/11/2026 |
|---|---|
| Pruebas Node/Angular de sesión y atajo | 16 aprobadas |
| Configuración HTTPS del build | 2 pruebas aprobadas |
| Pruebas Angular completas en Chromium | 18 aprobadas; incluyen las 16 comprobaciones anteriores, no son 34 casos distintos |
| Playwright | 3 aprobadas: dos integraciones HTTP/SQL y un E2E completo |
| Fixture SQL | Cadena de tablas y datos preparada en bases aisladas; 50 pulperías |
| Build cloud | Aprobado, con advertencias de tamaño de estilos |
| YAML de ambos workflows | Sintaxis revisada con js-yaml |
| main en GitHub | Protección aplicada y confirmada por API; PR y ambos checks obligatorios, incluso para administrador |
| HTTPS público | Login de Vercel y health de Render respondieron 200 |
| Actions remoto en verde | Pendiente del commit y push de la rama |
| Tercer flujo mezclado y publicado | Pendiente del PR, despliegue y prueba autenticada en producción |
| Release semana-7 | Preparado; todavía no creado |

Las 196 pruebas Jest del backend se ejecutan en el job E2E; la versión de referencia ya las había aprobado localmente. El contenedor Linux de Actions aún no ha ejecutado este workflow. La prueba local se realizó en Windows con SQL Server Express y Node 22.23.5.

## Protección y entrega

Se confirmó por API que main no estaba protegida y se configuró para requerir un PR y ambos checks aprobados, con rama actualizada, conversaciones resueltas y sin force push ni borrado. La regla incluye al administrador. No requiere una aprobación de otro revisor porque el repositorio lo mantiene una sola persona; sí exige pasar las pruebas y mezclar el PR.

La rama preparada es `semana-7/pipeline-cartera`. El propietario hace su commit y push. No se hicieron commits ni push automáticos. Al empezar, el frontend tenía 34 commits y ocho en los últimos diez días. Hace falta al menos un commit real adicional en main para el mínimo de 35; no se fabricó historial para aumentar la cifra.

Después del merge se debe esperar al pipeline de main y a Vercel, probar el botón en producción con una cuenta asignada a ruta y ejecutar Publicar semana-7 desde Actions. Ese workflow exige confirmar la prueba pública y se niega a publicar si no encuentra el PR mezclado y los checks de ese commit en verde.

## Límites y próximos pasos

Una respuesta HTTPS 200 no demuestra por sí sola el flujo autenticado. Aún faltan las URL reales del nuevo PR, el run remoto y el release. La clasificación de vulnerabilidades de dependencias sigue pendiente; no se cambiaron versiones mayores para ocultar avisos de npm audit.

Se usó Codex para revisar, implementar las pruebas y documentación, ejecutar verificaciones locales y configurar la protección de rama. Los resultados de producción y usuarios que no se observaron se dejaron expresamente pendientes.
