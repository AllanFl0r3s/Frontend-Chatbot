# 001. Mantener un entorno académico con datos ficticios

Fecha del registro: 21/11/2026. Estado: aplicada en el código existente y documentada en esta revisión. No se presenta esta fecha como el inicio de la implementación.

## Contexto

El proyecto parte de un chatbot empresarial, pero la entrega universitaria debe poder demostrarse fuera de la red de la empresa. Además, no necesitamos exponer información comercial real para explicar el funcionamiento.

La versión universitaria tiene sus propios repositorios, configuración local y despliegue en Vercel, Render y Azure SQL. La versión del trabajo se encuentra en `C:\Proyectos`; esta revisión corresponde a `Desktop\Workspace\Proyecto inicial`.

## Decisión

Mantener la demostración con fuentes y datos académicos explícitos. CHATBOT guarda cuentas y conversaciones de demostración; DW_ISTMA contiene clientes, visitas y datos comerciales ficticios. El backend usa `VISITS_DATA_SOURCE=academic` por defecto. Una fuente inválida falla con 503 y no cambia silenciosamente a otra.

Las migraciones y semillas se revisan antes de aplicarse. No se recrean las bases cada vez que se prepara una entrega. El frontend informa que los datos son ficticios. La configuración privada se conserva fuera de Git.

## Alternativas consideradas

| Alternativa | Motivo para descartarla en la universidad |
|---|---|
| Conectar la demostración a la base de la empresa | Depende de su red y de acceso autorizado; usar información real no es necesario para evaluar el proyecto. |
| Mostrar solo respuestas estáticas en Angular | Permite enseñar pantallas, pero no demuestra el recorrido HTTP, la autorización ni las consultas SQL. |
| Cambiar automáticamente de fuente cuando SQL falla | Puede presentar datos de otro entorno como si fueran el resultado solicitado. |

## Consecuencias

Podemos probar consultas y errores con resultados conocidos, sin depender de la red empresarial. A cambio, hay que mantener las semillas y aclarar sus fechas. El catálogo local y el de Azure difieren; una prueba debe indicar dónde se ejecutó.

Los resultados demuestran el comportamiento con datos ficticios, no la exactitud de una operación comercial real. El nombre heredado `prodConnection` se mantiene para no cambiar todos sus consumidores; debe interpretarse según el destino configurado.

## Dónde se ve

- Backend: `src/app.module.ts`, `src/visits/visits.core.ts` y `src/visits/visits.service.ts`.
- Backend: `database/local`, `database/azure` y `database/academic`.
- Frontend: `src/app/chat/chat.component.html` y [guía del menú](../menu-academico.md).
- [Arquitectura](../arquitectura.md) y [bitácora](../bitacora/semana-6.md).
