LEARN-CAP-72EA885A
# Chatbot académico — semana 6 en preparación

> Avance 23/11/2026: el backend local ya tiene historial de compras y promociones sugeridas con datos ficticios. No requiere cambiar las pantallas Angular. Las copias de la migración 006 y su verificador 007 están en database; la migración 006 ya se aplicó y verificó en Azure; la publicación del backend y su prueba pública siguen pendientes. Ver docs/replica-historial-promociones.md.

Aplicación: https://chatbot-clase-vista-previa.vercel.app

Backend: https://chatbotbackendlocal-1.onrender.com/health

Frontend Angular con API NestJS en [ChatbotBackendLocal](https://github.com/AllanFl0r3s/ChatbotBackendLocal), Render y bases Azure SQL. Proyecto académico con datos ficticios; el catálogo local es anterior al publicado.

El alcance incluye acceso, las seis consultas comerciales con datos ficticios, visitas autorizadas y administración por rol. El menú completo está implementado y su migración SQL está aplicada en Azure, según la revisión del 14/11. El 21/11 se repitieron las pruebas y compilaciones locales. Falta confirmar el código desplegado y repetir los recorridos públicos. No se certifica IA conversacional general.

- [Arquitectura: contexto, contenedores, capas y carpetas](docs/arquitectura.md).
- [Decisión 1: entorno académico separado](docs/decisiones/001-separar-entorno-academico.md).
- [Decisión 2: permisos de visitas en el backend](docs/decisiones/002-autorizar-visitas-en-backend.md).
- [Segundo flujo propuesto y verificación local](docs/segundo-flujo.md).
- [Bitácora de semana 6 y uso de IA](docs/bitacora/semana-6.md).
- [Preparación de issues y PR](docs/preparacion-pr-semana-6.md).

- [Pruebas con usuarios: guion y resultados](docs/pruebas-usuarios.md).
- [Bitácora de semana 5](docs/bitacora/semana-5.md).
- [Hallazgos y prioridades](docs/hallazgos-semana-5.md).
- [Configuración de despliegue](docs/despliegue-cloud.md).
- [Menú completo: ejemplos, datos y publicación](docs/menu-academico.md).

Entrega de semana 6 en preparación: faltan pruebas con participantes, elección final del segundo flujo, verificación pública, dos PR fusionados con sus issues y etiqueta/release semana-6. El 21/11 la página de acceso respondió 200; la API de Render agotó el plazo de espera de 45 segundos. Las credenciales se comparten privadamente. La documentación de semanas anteriores conserva el estado registrado en cada fecha.
