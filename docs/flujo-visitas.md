# Consultar visitas desde la aplicación local

Este avance agrega una pantalla /visits que consulta el backend mediante HTTP y JWT.
El cambio complementario del backend lee academico.Visitas, Clientes y Rutas en la
base DW_ISTMA local. Los datos son ficticios. No usa OpenAI ni escribe operaciones.

## Qué hace cada parte

- visits.component muestra filtros, resultados, paginación y errores. No contiene SQL.
- visits-api.service envía ruta, fecha, página y tamaño al GET /visits/clients.
- El interceptor existente agrega el JWT y la ruta está protegida por authGuard.
- El controller del backend recibe la solicitud; VisitsService valida parámetros y
  permisos; la consulta académica obtiene los datos de la segunda conexión local.
- Los permisos reales se verifican en el backend con VISITS_ROUTE_ACCESS. Escribir
  S09 en el formulario no concede acceso a esa ruta.

## Incorporar el backend complementario

El código del backend está en el repositorio hermano ChatbotBackendLocal. El archivo
integraciones/backend-visitas-academicas.patch contiene el commit probado, basado
en su versión local 542381f. Conserva la atribución y permite revisar exactamente
qué se cambia. No es código que Angular ejecute ni se aplica al backend empresarial.

Después de incorporar este commit del frontend, desde la terminal de la carpeta
Chatbotbackend académica se puede importar el cambio complementario:

```powershell
git am "..\ChatBotProyect\Frontend-Chatbot\integraciones\backend-visitas-academicas.patch"
```

Si el repositorio tiene cambios pendientes o Git informa un conflicto, detenerse y
revisarlo; no descartarlos ni forzar la aplicación. El paquete de entrega también
incluye el parche separado y un ayudante para comprobar ambas carpetas antes de
importar. El parche del backend no suma un commit adicional al historial del frontend.

## Configuración

La base local ya tiene migración 001 y semilla 001. No hay que recrearla ni cargarla
otra vez. El backend usa localhost/127.0.0.1,14330, CHATBOT y DW_ISTMA. Conserva su
.env privado y las credenciales de demostración ya configuradas.

La nueva versión del backend usa VISITS_DATA_SOURCE=academic por defecto. Si esa
variable ya está configurada como legacy, cambiarla expresamente a academic. Legacy
continúa consultando paco.APP_RV y mantiene sus datos/fechas anteriores. Una fuente
inválida falla con 503: nunca cambia silenciosamente a la otra base de datos.

La asignación de la cuenta de demostración ID 1 sigue siendo S08/S09 en
VISITS_ROUTE_ACCESS. La identidad procede del JWT, no de parámetros del formulario.

## Probarlo paso a paso

1. Incorporar ambos cambios y reiniciar el backend con npm run start:dev, puerto 3021.
2. Iniciar el frontend con npm start, puerto 4200.
3. Iniciar sesión con la cuenta local de demostración. En administración o en el chat,
   pulsar Visitas. También se puede abrir http://localhost:4200/visits tras el login.
4. Consultar ruta S08, fecha 2026-11-05 y tamaño 5. Se esperan 9 clientes distintos,
   13 registros y dos páginas de 5 y 4 clientes.
5. Cambiar a S09: se esperan 3 clientes y 3 registros para esa fecha.
6. Consultar S08 el 2026-11-03: no hay registros. Un error de conexión o permisos se
   muestra como error, sin reutilizar las cifras anteriores ni inventar ceros.

La tabla muestra códigos y número de registros, no visitas completadas ni ventas.
La fecha es la de Honduras: las fechas UTC se convierten antes de filtrar.
Al paginar se conservan los filtros de la consulta enviada; editar el formulario
requiere pulsar Consultar para iniciar una nueva búsqueda.

## Comprobaciones de este avance

- Compilación Nest y compilación Angular de desarrollo (navegador y SSR): correctas.
- 7 pruebas nuevas del servicio y 10 de reglas/paginación existentes: correctas.
- SQL exacto del adaptador ejecutado en SSMS sobre DW_ISTMA: pasaron cinco casos
  de paginación, aislamiento de rutas, fecha vacía y página fuera de rango.
- Conversión horaria probada con registros a 05:59 y 06:00 UTC en la base temporal;
  los cuatro registros de prueba se revirtieron.

Las 5 pruebas HTTP existentes no pudieron completarse: la terminal restringida
denegó conexiones locales con EACCES. El intento TypeORM directo también quedó
bloqueado (ESOCKET). El autor confirmó posteriormente el inicio de sesión, el acceso a Visitas y resultados visibles desde las aplicaciones iniciadas en sus terminales habituales. Esto confirma el recorrido manual local, sin dar por aprobada la suite HTTP bloqueada. Ver [bitácora semana 3](bitacora/semana-3.md).

No se recompiló ni publicó esta versión en Vercel. Su vista previa sigue sin backend
público ni login habilitado. Publicar backend/base, probar el flujo en producción y
preparar la entrega semana-3 son trabajos pendientes; llegar a 15 commits por sí
solo no completa esos requisitos.
