# Issues y pull requests pendientes de semana 6

21/11/2026. Estos son borradores para publicar, no issues ni PR existentes. La consulta a GitHub de hoy encontró cero PR fusionados en Frontend-Chatbot y ChatbotBackendLocal. No se hizo push ni se publicó contenido en GitHub durante esta revisión.

El trabajo de hoy es documental y de validación de código existente. Se propone agruparlo en dos PR para que cada revisión tenga un propósito claro. Como los cuatro commits están en main local, antes de publicarlos habrá que organizarlos en ramas desde la base remota; no subirlos directamente a main si se quiere que entren mediante PR.

## Issue y PR 1: arquitectura y decisiones

Repositorio: [Frontend-Chatbot](https://github.com/AllanFl0r3s/Frontend-Chatbot).

Título del issue: **Documentar la arquitectura y las decisiones de la versión académica**.

Texto propuesto:

> La entrega de semana 6 necesita explicar cómo se relacionan Angular, NestJS y las dos bases académicas. Falta un documento que permita ubicar las capas del código y las razones de separar los datos de demostración y autorizar las rutas en el servidor.
>
> Se acepta cuando docs/arquitectura.md contiene contexto, contenedores, capas y carpetas, y docs/decisiones contiene al menos dos registros con contexto, decisión, alternativas y consecuencias. La descripción debe coincidir con el código existente.

Título del PR: **Documentar arquitectura y dos decisiones del chatbot académico**.

Descripción propuesta:

> Agrega los diagramas de contexto y contenedores, las capas del stack y la estructura de los dos repositorios. Registra las decisiones sobre datos ficticios separados y autorización de visitas por ruta en el backend.
>
> Se contrastó la documentación con los módulos, servicios, configuración cloud y permisos actuales. No cambia el comportamiento de la aplicación.
>
> Al publicar, añadir Closes seguido del número real del issue anterior.

Commits preparados: `301ec84` y `62638d5`.

## Issue y PR 2: recorrido de visitas y evidencia

Repositorio: [Frontend-Chatbot](https://github.com/AllanFl0r3s/Frontend-Chatbot).

Título del issue: **Registrar el recorrido de visitas y el estado real de semana 6**.

Texto propuesto:

> El recorrido de visitas está implementado, pero la evidencia anterior no permite certificarlo como segundo flujo en producción. Hace falta registrar las comprobaciones locales, distinguirlas de las pruebas con personas y dejar claros los pasos de publicación y revalidación.
>
> Este issue documental se acepta con una guía del recorrido, evidencia técnica sin credenciales, bitácora de semana 6 con uso de IA y README actualizado. Las pruebas con participantes y la revalidación pública deben seguir visibles como pendientes; cerrar este issue no certifica la entrega completa.

Título del PR: **Registrar visitas, evidencia local y bitácora de semana 6**.

Descripción propuesta:

> Documenta visitas como candidato al segundo flujo y conserva los resultados de doce comprobaciones HTTP con SQL académico local. Actualiza el README y registra el uso de IA y los pendientes de la entrega.
>
> Validación: 122 pruebas Jest del backend, diez pruebas de reglas de visitas, catorce pruebas del frontend y ambas compilaciones correctas. La API pública agotó el plazo de espera; las pruebas con personas siguen pendientes. No incorpora funciones nuevas ni declara completada la semana 6.
>
> Al publicar, añadir Closes seguido del número real del issue documental anterior. Publicar después del PR de arquitectura para conservar los enlaces de documentación.

Incluye `844a431` y el commit que agrega esta preparación, la bitácora y el README.

## Seguimiento que debe quedar abierto

Después de publicar los issues documentales, crear o enlazar un issue funcional separado para validar el segundo flujo en producción a partir de las pruebas con usuarios. No cerrarlo con los PR de documentación. Registrar en él el commit desplegado, resultados, dificultades y decisión final sobre el flujo.

Cuando existan los dos PR, sustituir este estado por sus enlaces y fechas reales de fusión. Mantener la etiqueta/release semana-6 pendiente hasta cerrar los requisitos de la entrega.
